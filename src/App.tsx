import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Camera, 
  Settings, 
  Zap, 
  MapPin, 
  Plus, 
  Calendar, 
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';

import { WorkOrder, Technician, ChecklistItem, WorkOrderNote } from './types';
import { INITIAL_WORK_ORDERS, INITIAL_TECHNICIANS } from './initialData';

import BottomNavBar from './components/BottomNavBar';
import Dashboard from './components/Dashboard';
import WorkOrdersList from './components/WorkOrdersList';
import NewOrderForm from './components/NewOrderForm';
import TechniciansList from './components/TechniciansList';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Initialize from LocalStorage or mock defaults
  const [orders, setOrders] = useState<WorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cctv_scheduler_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
    } catch {
      return INITIAL_WORK_ORDERS;
    }
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const saved = localStorage.getItem('cctv_scheduler_technicians_v1');
      return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
    } catch {
      return INITIAL_TECHNICIANS;
    }
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('cctv_scheduler_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cctv_scheduler_technicians_v1', JSON.stringify(technicians));
  }, [technicians]);

  // Handlers for App state modifications
  const handleAddOrder = (newOrder: WorkOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateStatus = (orderId: string, status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Intelligent behavior: if marking "In Progress" and technician exists,
          // automatically set that technician status to 'On Site'
          if (status === 'In Progress' && o.technicianId !== 'unassigned') {
            handleUpdateTechStatus(o.technicianId, 'On Site');
          }
          // If marking "Completed" and technician exists, transition technician status back to 'Available' 
          // (assuming they finished their active physical work)
          if (status === 'Completed' && o.technicianId !== 'unassigned') {
            handleUpdateTechStatus(o.technicianId, 'Available');
          }
          return { ...o, status };
        }
        return o;
      })
    );
  };

  const handleUpdateAssignment = (orderId: string, technicianId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, technicianId } : o))
    );
  };

  const handleUpdateChecklist = (orderId: string, checklist: ChecklistItem[]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, checklist } : o))
    );
  };

  const handleAddNote = (orderId: string, noteText: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const activeTech = technicians.find((t) => t.id === order.technicianId);
    const authorName = activeTech ? activeTech.name : 'Dispatcher Operator';

    const newNote: WorkOrderNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      timestamp: new Date().toISOString(),
      author: authorName,
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, notes: [...o.notes, newNote] } : o))
    );
  };

  const handleEditOrder = (updatedOrder: WorkOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleUpdateTechStatus = (techId: string, status: 'Available' | 'On Site' | 'Offline') => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, status } : t))
    );
  };

  // Switch to specific work order & focus on its details
  const handleSelectOrderAndFocus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('orders');
  };

  // Pending counter for badge
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200">
      
      {/* Top Professional Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-3xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-emerald-400 rounded-xl shadow-xs">
              <Camera className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="text-left leading-none">
              <div id="app-title" className="font-bold text-sm sm:text-base tracking-tight text-slate-900 font-sans">
                CCTV Dispatcher
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">
                Grid Control v1.4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator tag */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                System Connected
              </span>
            </div>

            {/* active user context bubble */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              <span className="text-xs font-mono font-medium text-slate-600 truncate max-w-[140px] sm:max-w-xs">
                S.M.SALMAN397@gmail.com
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6 pb-20 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                orders={orders}
                technicians={technicians}
                onSelectOrder={handleSelectOrderAndFocus}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'orders' && (
              <WorkOrdersList 
                orders={orders}
                technicians={technicians}
                onUpdateStatus={handleUpdateStatus}
                onUpdateAssignment={handleUpdateAssignment}
                onUpdateChecklist={handleUpdateChecklist}
                onAddNote={handleAddNote}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
              />
            )}

            {activeTab === 'new-order' && (
              <NewOrderForm 
                technicians={technicians}
                onAddOrder={handleAddOrder}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'technicians' && (
              <TechniciansList 
                technicians={technicians}
                orders={orders}
                onUpdateStatus={handleUpdateTechStatus}
                onSelectOrder={handleSelectOrderAndFocus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Safe Navigation (strict user layout requirement: bottom navbar, NO sidebar) */}
      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount}
      />
    </div>
  );
}

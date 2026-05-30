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
import CalendarView from './components/CalendarView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Global app themes layout switcher state (choices: slate, cyber, steel, solar)
  const [themeStyle, setThemeStyle] = useState<'slate' | 'cyber' | 'steel' | 'solar'>(() => {
    try {
      const saved = localStorage.getItem('cctv_global_theme_v1');
      return (saved as any) || 'slate';
    } catch {
      return 'slate';
    }
  });

  // Synchronize layout theme state
  useEffect(() => {
    try {
      localStorage.setItem('cctv_global_theme_v1', themeStyle);
    } catch (e) {
      console.error(e);
    }
  }, [themeStyle]);

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

  // Theme styling configurations classes mapping
  const currentTheme = {
    slate: {
      bodyBg: "bg-slate-50 text-slate-800",
      headerBg: "bg-white/95 border-b border-slate-200/60",
      headerText: "text-slate-900 border-slate-100",
      appTitleClass: "text-slate-900 font-sans",
      badgeLive: "bg-emerald-50 text-emerald-800 border-emerald-150",
      badgeUser: "bg-slate-50 text-slate-600 border-slate-100",
      badgeUserCircle: "bg-indigo-500",
      subText: "text-slate-400"
    },
    cyber: {
      bodyBg: "bg-slate-950 text-slate-100 dark selection:bg-emerald-500",
      headerBg: "bg-slate-900/95 border-b border-slate-800 shadow-xl",
      headerText: "text-slate-100",
      appTitleClass: "text-[#10b981] font-mono uppercase tracking-wider",
      badgeLive: "bg-emerald-950/40 text-emerald-400 border border-emerald-990/30",
      badgeUser: "bg-slate-950 text-slate-350 border-slate-800",
      badgeUserCircle: "bg-emerald-400",
      subText: "text-slate-500"
    },
    steel: {
      bodyBg: "bg-[#eaf3f3] text-slate-900 selection:bg-teal-200",
      headerBg: "bg-teal-900 text-teal-150 border-b border-teal-950 shadow-md",
      headerText: "text-white",
      appTitleClass: "text-white font-sans uppercase tracking-tight",
      badgeLive: "bg-teal-955 text-teal-200 border border-teal-800",
      badgeUser: "bg-teal-950/80 text-teal-100 border-teal-900",
      badgeUserCircle: "bg-sky-400",
      subText: "text-teal-300"
    },
    solar: {
      bodyBg: "bg-[#faf6f0] text-[#3c2a15] selection:bg-amber-100",
      headerBg: "bg-[#2d1c0c] text-amber-50 border-b border-[#3d2714] shadow-sm",
      headerText: "text-amber-50",
      appTitleClass: "text-amber-300 font-serif font-bold italic tracking-wide",
      badgeLive: "bg-[#3d2714] text-amber-250 border border-amber-900/30",
      badgeUser: "bg-[#3d2714]/85 text-amber-100 border-[#3d2714]",
      badgeUserCircle: "bg-amber-500",
      subText: "text-amber-450"
    }
  }[themeStyle] || {
    bodyBg: "bg-slate-50 text-slate-800",
    headerBg: "bg-white/95 border-b border-slate-100",
    headerText: "text-slate-900",
    appTitleClass: "text-slate-900 font-sans",
    badgeLive: "bg-emerald-50 text-emerald-800 border border-emerald-150",
    badgeUser: "bg-slate-50 text-slate-600 border border-slate-100",
    badgeUserCircle: "bg-indigo-500",
    subText: "text-slate-400"
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${currentTheme.bodyBg}`}>
      
      {/* Top Professional Header Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md px-4 py-2.5 shadow-2xs transition-all duration-300 ${currentTheme.headerBg}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo Brand metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-emerald-400 rounded-xl shadow-xs shrink-0">
                <Camera className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="text-left leading-none">
                <div id="app-title" className={`font-bold text-sm sm:text-base tracking-tight ${currentTheme.appTitleClass}`}>
                  CCTV Dispatcher
                </div>
                <span className={`text-[9px] font-mono tracking-wider font-bold uppercase ${currentTheme.subText}`}>
                  Grid Control v1.6
                </span>
              </div>
            </div>

            {/* Micro display in mobile */}
            <div className="md:hidden flex items-center gap-1.5 bg-emerald-50/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">CONNECTED</span>
            </div>
          </div>

          {/* Theme customiser & User metadata */}
          <div className="flex flex-wrap items-center gap-2.5 justify-between md:justify-end">
            
            {/* 4 Multi-Theme Switcher Segment Control */}
            <div className="flex items-center bg-black/10 dark:bg-black/30 p-1 rounded-xl border border-black/5 dark:border-white/5">
              {(['slate', 'cyber', 'steel', 'solar'] as const).map((styleId) => {
                const label = styleId === 'slate' ? '🌞' : styleId === 'cyber' ? '🌑' : styleId === 'steel' ? '🌊' : '🍁';
                const labelFull = styleId === 'slate' ? 'Slate' : styleId === 'cyber' ? 'Cyber' : styleId === 'steel' ? 'Steel' : 'Solar';
                const isSelected = themeStyle === styleId;
                return (
                  <button
                    key={styleId}
                    onClick={() => setThemeStyle(styleId)}
                    title={`Switch layout to ${labelFull} format`}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all duration-200 focus:outline-none flex items-center gap-1 ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm scale-102 hover:bg-emerald-400' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">{labelFull}</span>
                  </button>
                );
              })}
            </div>

            {/* Metadata right elements */}
            <div className="flex items-center gap-2">
              {/* Live indicator tag */}
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border animate-pulse ${currentTheme.badgeLive}`}>
                <span className="w-1.5 h-1.5 bg-emerald-505 bg-emerald-500 rounded-full" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                  Live System Connected
                </span>
              </div>

              {/* Active email context bubble */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${currentTheme.badgeUser}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${currentTheme.badgeUserCircle}`} />
                <span className="text-[10px] font-mono font-bold truncate max-w-[120px] sm:max-w-xs">
                  S.M.SALMAN397@gmail.com
                </span>
              </div>
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
                themeStyle={themeStyle}
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
                themeStyle={themeStyle}
               />
            )}

            {activeTab === 'new-order' && (
              <NewOrderForm 
                technicians={technicians}
                onAddOrder={handleAddOrder}
                setActiveTab={setActiveTab}
                themeStyle={themeStyle}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                orders={orders}
                technicians={technicians}
                onSelectOrder={handleSelectOrderAndFocus}
                setActiveTab={setActiveTab}
                onUpdateStatus={handleUpdateStatus}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
                themeStyle={
                  themeStyle === 'slate' ? 'slate-modern' :
                  themeStyle === 'cyber' ? 'cyber-cctv' :
                  themeStyle === 'steel' ? 'steel-teal' :
                  themeStyle === 'solar' ? 'solar-amber' : 'slate-modern'
                }
                onThemeStyleChange={(t) => {
                  const mapped = t === 'slate-modern' ? 'slate' : t === 'cyber-cctv' ? 'cyber' : t === 'steel-teal' ? 'steel' : 'solar';
                  setThemeStyle(mapped as any);
                }}
              />
            )}

            {activeTab === 'technicians' && (
              <TechniciansList 
                technicians={technicians}
                orders={orders}
                onUpdateStatus={handleUpdateTechStatus}
                onSelectOrder={handleSelectOrderAndFocus}
                themeStyle={themeStyle}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Safe Navigation */}
      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount}
      />
    </div>
  );
}

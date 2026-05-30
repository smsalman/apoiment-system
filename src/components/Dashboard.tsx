import React from 'react';
import { WorkOrder, Technician } from '../types';
import { 
  Camera, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface DashboardProps {
  orders: WorkOrder[];
  technicians: Technician[];
  onSelectOrder: (orderId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ orders, technicians, onSelectOrder, setActiveTab }: DashboardProps) {
  // Filter for today's orders (relates to index match of getRelativeDate(0))
  // To keep it clean, let's look at orders on today's date "2026-05-30" or general overall stats
  const todayStr = '2026-05-30';
  
  const todayOrders = orders.filter(o => o.serviceDate === todayStr);
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const inProgressOrders = orders.filter(o => o.status === 'In Progress');
  const completedOrders = orders.filter(o => o.status === 'Completed');
  
  const activeTechs = technicians.filter(t => t.status === 'On Site').length;
  const availableTechs = technicians.filter(t => t.status === 'Available').length;

  // Calculate completion percentage
  const totalCompleted = completedOrders.length;
  const totalJobs = orders.filter(o => o.status !== 'Cancelled').length;
  const completionRate = totalJobs > 0 ? Math.round((totalCompleted / totalJobs) * 100) : 0;

  // Find unassigned urgent jobs
  const unassignedUrgent = orders.filter(o => o.technicianId === 'unassigned' && o.priority === 'High');

  return (
    <div className="space-y-6 pb-24">
      {/* Brand Header */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono uppercase tracking-wider">
            Live Ops Monitor
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CCTV Net-Dispatch</h1>
          <p className="text-slate-400 text-sm max-w-sm">
            Operational dashboard for technician assignments and camera install streams.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Camera className="w-48 h-48 text-emerald-400" />
        </div>
      </div>

      {/* Action Banners */}
      {unassignedUrgent.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 animate-pulse shadow-sm">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Urgent Dispatch Warning</h4>
            <p className="text-xs text-rose-700 mt-1">
              There is {unassignedUrgent.length} High-Priority installation unassigned. Tap here to view and assign a technician immediately.
            </p>
            <button 
              onClick={() => {
                setActiveTab('orders');
              }}
              className="mt-2 text-xs font-semibold underline flex items-center gap-1 hover:text-rose-950"
            >
              Resolve Assignments <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Grid of Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Today's Load</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{todayOrders.length}</div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Active field items today</p>
          </div>
        </div>

        {/* Dispatch Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">In Progress</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Camera className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{inProgressOrders.length}</div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Active tech on-site setup</p>
          </div>
        </div>

        {/* Team State */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">On-Duty Techs</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {availableTechs + activeTechs}<span className="text-xs text-slate-400 ml-1">/ {technicians.length}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              <span className="text-indigo-600 font-semibold">{activeTechs} On Site</span> • <span className="text-emerald-600 font-semibold">{availableTechs} Avail</span>
            </p>
          </div>
        </div>

        {/* Global Success rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Success</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operational Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Agenda */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-900 text-lg">Today's Deployment</h3>
              <p className="text-xs text-slate-500">Service visits and setups scheduled for today.</p>
            </div>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              Manage ({orders.length}) <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {todayOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-100 rounded-xl">
                <Briefcase className="h-8 w-8 mx-auto stroke-1 mb-2 text-slate-300" />
                <p className="text-sm font-medium">No order runs scheduled for today.</p>
                <button
                  onClick={() => setActiveTab('new-order')}
                  className="mt-2 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-mono tracking-wide hover:bg-slate-800 transition"
                >
                  + Add Today's First Job
                </button>
              </div>
            ) : (
              todayOrders.map((order) => {
                const assignedTech = technicians.find(t => t.id === order.technicianId);
                const progressNum = order.checklist.length > 0 
                  ? Math.round((order.checklist.filter(c => c.completed).length / order.checklist.length) * 100) 
                  : 0;

                return (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      // Switch tab to orders and trigger popup
                      onSelectOrder(order.id);
                    }}
                    className="group border border-slate-100 hover:border-emerald-200 hover:shadow-xs rounded-xl p-4 transition-all duration-150 cursor-pointer text-left focus:outline-none flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                          {order.id}
                        </span>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          order.priority === 'High' 
                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                            : order.priority === 'Medium' 
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-sky-50 text-sky-700 border-sky-100'
                        }`}>
                          {order.priority}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                          order.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : order.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : order.status === 'Cancelled'
                            ? 'bg-slate-50 text-slate-500 border border-slate-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors line-clamp-1">
                        {order.customerName}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{order.customerAddress}</span>
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2 shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold text-slate-900">{order.timeSlot}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Slot Timing</div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <div className="w-5 h-5 rounded-full bg-slate-950 font-mono text-[9px] text-slate-100 flex items-center justify-center font-bold">
                          {assignedTech?.avatar || '??'}
                        </div>
                        <span className="text-xs text-slate-700 font-medium">
                          {assignedTech?.name?.split(' ')[0] || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deployment Statistics */}
        <div className="space-y-6">
          {/* Active Technicians Box */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-md">Today's Service Crew</h3>
            <div className="divide-y divide-slate-100">
              {technicians.map((tech) => {
                const assignedToday = orders.filter(
                  o => o.technicianId === tech.id && o.serviceDate === todayStr
                ).length;

                return (
                  <div key={tech.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-mono text-xs font-bold flex items-center justify-center">
                        {tech.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-950">{tech.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono capitalize">
                          {tech.status === 'On Site' ? '🎥 On Site Work' : `${tech.status}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                        tech.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : tech.status === 'On Site'
                          ? 'bg-blue-50 text-blue-700 border border-blue-150'
                          : 'bg-slate-50 text-slate-505 border-slate-150'
                      }`}>
                        {tech.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">
                        {assignedToday} {assignedToday === 1 ? 'job' : 'jobs'} today
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button 
              onClick={() => setActiveTab('technicians')}
              className="w-full text-center text-xs text-slate-600 hover:text-emerald-600 font-semibold pt-1 block hover:underline"
            >
              Update Crew Status
            </button>
          </div>

          {/* Quick Guide Tips */}
          <div className="bg-slate-950 text-slate-300 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">Grid Operator Tips</h4>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Deploy technicians based on their localized geographic service sector.</li>
              <li>Check off completed installation items directly in the Work Orders checklist card.</li>
              <li>Write specific camera IP addresses or channel logs inside Job Notes.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

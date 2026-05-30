import React, { useState } from 'react';
import { WorkOrder, Technician, ChecklistItem, WorkOrderNote } from '../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Trash2, 
  X, 
  CheckSquare, 
  Square,
  MessageSquare,
  User,
  Plus,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface WorkOrdersListProps {
  orders: WorkOrder[];
  technicians: Technician[];
  onUpdateStatus: (orderId: string, status: any) => void;
  onUpdateAssignment: (orderId: string, techId: string) => void;
  onUpdateChecklist: (orderId: string, checklist: ChecklistItem[]) => void;
  onAddNote: (orderId: string, noteText: string) => void;
  onEditOrder: (updatedOrder: WorkOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (orderId: string | null) => void;
  themeStyle?: 'slate' | 'cyber' | 'steel' | 'solar';
}

export default function WorkOrdersList({ 
  orders, 
  technicians, 
  onUpdateStatus, 
  onUpdateAssignment, 
  onUpdateChecklist, 
  onAddNote,
  onEditOrder,
  onDeleteOrder,
  selectedOrderId,
  setSelectedOrderId,
  themeStyle = 'slate'
}: WorkOrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [filterTech, setFilterTech] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Modal Editing Internal State
  const [newNoteText, setNewNoteText] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Find selected order
  const activeOrder = orders.find(o => o.id === selectedOrderId);

  // Unified visual adjustments depending on choice
  const config = {
    slate: {
      card: "bg-white border border-slate-150/90 shadow-3xs text-slate-900",
      activeTab: "bg-slate-950 text-white font-bold",
      inactiveTab: "bg-slate-100 text-slate-600 hover:bg-slate-205",
      headerBg: "bg-slate-950 text-slate-50",
      inputClass: "bg-white text-slate-900 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500",
      accentButton: "bg-slate-950 text-white hover:bg-slate-850",
      pill: "bg-slate-55 bg-slate-50 text-slate-705 border border-slate-100",
      subtleCard: "bg-slate-55 bg-slate-50 border border-slate-100",
      textDark: "text-slate-900",
      textMuted: "text-slate-500 font-medium",
      borderLine: "border-slate-100"
    },
    cyber: {
      card: "bg-slate-900 border border-slate-800 text-slate-100 shadow-md",
      activeTab: "bg-emerald-505 bg-emerald-500 text-slate-955 text-slate-950 font-bold",
      inactiveTab: "bg-slate-800 text-slate-400 hover:bg-slate-700",
      headerBg: "bg-slate-950 border border-slate-800 text-slate-100",
      inputClass: "bg-slate-950 text-slate-100 border-slate-850 focus:ring-emerald-500 focus:border-emerald-500",
      accentButton: "bg-emerald-505 bg-emerald-500 text-slate-955 text-slate-950 hover:bg-emerald-400 font-bold",
      pill: "bg-slate-950 text-slate-350 border border-slate-850",
      subtleCard: "bg-slate-950/60 border border-slate-850",
      textDark: "text-[#10b981] font-mono",
      textMuted: "text-slate-400 font-mono",
      borderLine: "border border-slate-850"
    },
    steel: {
      card: "bg-white border border-teal-150/90 text-slate-900 shadow-sm",
      activeTab: "bg-teal-700 text-white font-medium",
      inactiveTab: "bg-teal-50 text-teal-800 hover:bg-teal-100",
      headerBg: "bg-teal-900 text-teal-100",
      inputClass: "bg-white text-slate-900 border-teal-150 focus:ring-teal-500 focus:teal-500",
      accentButton: "bg-teal-700 text-white hover:bg-teal-850",
      pill: "bg-teal-50 text-teal-950 border border-teal-100",
      subtleCard: "bg-teal-50/20 border border-teal-100/60",
      textDark: "text-teal-950 font-medium",
      textMuted: "text-teal-850",
      borderLine: "border-teal-100"
    },
    solar: {
      card: "bg-white border border-amber-205/85 text-amber-950 shadow-2xs",
      activeTab: "bg-amber-800 text-white font-bold hover:bg-amber-900",
      inactiveTab: "bg-[#faf6f0] text-amber-900 hover:bg-[#eae0d0]",
      headerBg: "bg-[#2d1c0c] text-amber-50",
      inputClass: "bg-white text-amber-950 border-amber-200 focus:ring-amber-500 focus:amber-500",
      accentButton: "bg-amber-800 text-white hover:bg-amber-900 font-bold",
      pill: "bg-[#faf6f0] text-amber-900 border border-[#eae0d0]",
      subtleCard: "bg-[#faf6f0] border border-amber-100",
      textDark: "text-[#2d1c0c] font-bold",
      textMuted: "text-[#785429]",
      borderLine: "border-amber-100/65"
    }
  }[themeStyle] || {
    card: "bg-white border border-slate-100 shadow-3xs text-slate-900",
    activeTab: "bg-slate-955 text-white font-bold",
    inactiveTab: "bg-slate-100 text-slate-650 hover:bg-slate-200/50",
    headerBg: "bg-slate-950 text-slate-50",
    inputClass: "bg-white text-slate-900 border-slate-200",
    accentButton: "bg-slate-955 text-white hover:bg-slate-850",
    pill: "bg-slate-50 text-slate-705 border border-slate-100",
    subtleCard: "bg-slate-50 border border-slate-100",
    textDark: "text-slate-900",
    textMuted: "text-slate-555",
    borderLine: "border-[#e2e8f0]"
  };

  // Filters calculation
  const filteredOrders = orders.filter((order) => {
    // Search Match
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.jobType.toLowerCase().includes(searchTerm.toLowerCase());

    // Status Tab Match
    const matchesStatus = selectedStatusTab === 'All' || order.status === selectedStatusTab;

    // Technician Match
    const matchesTech = filterTech === 'All' || order.technicianId === filterTech;

    // Priority Match
    const matchesPriority = filterPriority === 'All' || order.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesTech && matchesPriority;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Cancelled': return 'bg-slate-50 text-slate-500 border border-slate-100';
      default: return 'bg-amber-50 text-amber-700 border border-amber-100'; // Pending
    }
  };

  // Checklist Actions inside detail modal
  const handleToggleCheckstep = (stepId: string) => {
    if (!activeOrder) return;
    const nextChecklist = activeOrder.checklist.map((step) => {
      if (step.id === stepId) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });
    onUpdateChecklist(activeOrder.id, nextChecklist);
  };

  const handleAddCheckstep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !newChecklistText.trim()) return;
    
    const newStep: ChecklistItem = {
      id: `step-${Date.now()}`,
      text: newChecklistText.trim(),
      completed: false
    };

    const nextChecklist = [...activeOrder.checklist, newStep];
    onUpdateChecklist(activeOrder.id, nextChecklist);
    setNewChecklistText('');
  };

  const handleRemoveCheckstep = (stepId: string) => {
    if (!activeOrder) return;
    const nextChecklist = activeOrder.checklist.filter(s => s.id !== stepId);
    onUpdateChecklist(activeOrder.id, nextChecklist);
  };

  const handleAddNoteCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !newNoteText.trim()) return;

    onAddNote(activeOrder.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Search and Filters Strip */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, location, order ID, or details..."
            className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Dropdowns filters row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Filter Technician</label>
            <select
              value={filterTech}
              onChange={(e) => setFilterTech(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 bg-white rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Technicians</option>
              <option value="unassigned">⚠️ Unassigned</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">Filter Urgency</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 bg-white rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🔵 Low Priority</option>
            </select>
          </div>
        </div>

        {/* Segmented Status Tabs Filter */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex gap-1.5 w-full">
            {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map((tab) => {
              const count = tab === 'All' 
                ? orders.length 
                : orders.filter(o => o.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setSelectedStatusTab(tab)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-medium font-sans ${
                    selectedStatusTab === tab
                      ? 'bg-slate-900 border-slate-950 text-white font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                  <span className="ml-1.5 opacity-60 font-mono text-[10px] font-semibold bg-slate-200/30 text-current px-1.5 py-0.5 rounded-md">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Work Orders */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-medium">No work orders match the criteria.</p>
            <p className="text-xs text-slate-300 mt-1">Clear filters or append search query to inspect again.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const assignedTech = technicians.find(t => t.id === order.technicianId);
            
            // Calculate checklist progress
            const checkedCount = order.checklist.filter(c => c.completed).length;
            const totalCount = order.checklist.length;
            const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

            return (
              <div 
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 shadow-3xs hover:shadow-xs p-5 transition duration-150 cursor-pointer text-left focus:outline-none relative"
              >
                {/* Upper line: ID & Metadata badges */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {order.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {order.jobType}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold font-sans px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Core Title */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-slate-950 transition-colors text-base">
                    {order.customerName}
                  </h3>
                  <p className="text-xs text-slate-600 font-mono line-clamp-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{order.customerAddress}</span>
                  </p>
                </div>

                {/* Sub Description */}
                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/40">
                  {order.description}
                </p>

                {/* Progress Indicators */}
                {totalCount > 0 && (
                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold">
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-emerald-500" />
                        Checklist Completion
                      </span>
                      <span>{checkedCount}/{totalCount} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom line: Scheduler Time Slot & Crew assigned */}
                <div className="border-t border-slate-100 pt-3 mt-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1 text-xs font-mono font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.serviceDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.timeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 shrink-0 self-start sm:self-center">
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                      {assignedTech?.avatar || '??'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {assignedTech?.name || 'Unassigned Standby'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* DETAIL DRAWER/MODAL POPUP */}
      {activeOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-900 text-white relative">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{activeOrder.id}</span>
                  <span className="text-xs uppercase bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                    {activeOrder.jobType}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg tracking-tight">{activeOrder.customerName}</h3>
                <p className="text-slate-400 text-xs font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{activeOrder.customerAddress}</span>
                </p>
              </div>

              <button 
                onClick={() => {
                  setSelectedOrderId(null);
                  setNewNoteText('');
                  setNewChecklistText('');
                }}
                className="p-1 px-1.5 hover:bg-white/15 rounded-lg text-slate-300 transition focus:outline-none font-bold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-left">
              
              {/* Detailed description */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Scope of work</span>
                <p className="text-slate-700 text-sm leading-relaxed p-3.5 bg-slate-50 border border-slate-150 rounded-xl font-sans">
                  {activeOrder.description}
                </p>
              </div>

              {/* Status & Reschedule dispatcher grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Workflow Status Coordinator</span>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    {(['Pending', 'In Progress', 'Completed', 'Cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateStatus(activeOrder.id, st)}
                        className={`text-[10px] uppercase font-mono py-2 rounded-lg font-bold border transition ${
                          activeOrder.status === st 
                            ? st === 'Completed'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-600 hover:bg-emerald-400 font-bold'
                              : st === 'In Progress'
                              ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-400 font-bold'
                              : st === 'Cancelled'
                              ? 'bg-slate-600 text-white border-slate-700 hover:bg-slate-500 font-bold'
                              : 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-400 font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Assign Serviceman</span>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      value={activeOrder.technicianId}
                      onChange={(e) => onUpdateAssignment(activeOrder.id, e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-250 bg-white rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="unassigned">⚠️ Unassigned Standby Pool</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="text-[9px] uppercase text-slate-400 font-mono">Service Date</span>
                      <input 
                        type="date"
                        value={activeOrder.serviceDate}
                        onChange={(e) => onEditOrder({ ...activeOrder, serviceDate: e.target.value })}
                        className="w-full text-[11px] font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase text-slate-400 font-mono">Time Window</span>
                      <select 
                        value={activeOrder.timeSlot}
                        onChange={(e) => onEditOrder({ ...activeOrder, timeSlot: e.target.value })}
                        className="w-full text-[11px] font-mono border border-slate-200 bg-white rounded-lg px-1 py-1.5 focus:outline-none"
                      >
                        <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM</option>
                        <option value="11:30 AM - 02:00 PM">11:30 AM - 02:00 PM</option>
                        <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM</option>
                        <option value="04:30 PM - 07:00 PM">04:30 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist details */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <span>Operational Checklist ({activeOrder.checklist.filter(c=>c.completed).length}/{activeOrder.checklist.length})</span>
                  <span>Interactive</span>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {activeOrder.checklist.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 italic py-2">
                      No checksteps currently generated.
                    </div>
                  ) : (
                    activeOrder.checklist.map((step) => (
                      <div key={step.id} className="flex items-center justify-between group/step py-1">
                        <button 
                          onClick={() => handleToggleCheckstep(step.id)}
                          className="flex items-start gap-2.5 text-left text-xs text-slate-700 cursor-pointer focus:outline-none"
                        >
                          {step.completed ? (
                            <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={`leading-tight ${step.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {step.text}
                          </span>
                        </button>
                        <button 
                          onClick={() => handleRemoveCheckstep(step.id)}
                          className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover/step:opacity-100 p-0.5 cursor-pointer ml-3 focus:outline-none"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Quick step append */}
                  <form onSubmit={handleAddCheckstep} className="flex gap-2 pt-2 border-t border-slate-200 mt-2">
                    <input 
                      type="text" 
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      placeholder="Add another physical step to verification catalog..."
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                    <button 
                      type="submit"
                      className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-mono font-bold hover:bg-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Feed/Notes Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">CCTV Log Updates Feed</span>
                
                {/* Notes list */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {activeOrder.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">No field notes logged for this run.</p>
                  ) : (
                    activeOrder.notes.map((note) => (
                      <div key={note.id} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs text-slate-700">
                        <p className="leading-relaxed font-sans">{note.text}</p>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100/40">
                          <span>👤 Tech: {note.author}</span>
                          <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Log Note form */}
                <form onSubmit={handleAddNoteCommit} className="flex gap-2 mt-2">
                  <input 
                    type="text" 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type field note (e.g. Channel 4 testing completed, signal clear)..."
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                  <button 
                    type="submit"
                    className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-mono font-bold px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Log Note
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between gap-3 shrink-0">
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to completely delete this work order from the dispatcher calendar?')) {
                    onDeleteOrder(activeOrder.id);
                    setSelectedOrderId(null);
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-500 border border-rose-250 hover:border-rose-400 px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Run
              </button>

              <button 
                onClick={() => {
                  setSelectedOrderId(null);
                  setNewNoteText('');
                  setNewChecklistText('');
                }}
                className="text-xs font-bold font-mono tracking-wider bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Control Pane
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { WorkOrder, Technician } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Shield, 
  Tv, 
  Laptop, 
  Monitor, 
  UserCheck,
  CheckCircle,
  Play,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Eye,
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';

interface CalendarViewProps {
  orders: WorkOrder[];
  technicians: Technician[];
  onSelectOrder: (orderId: string) => void;
  setActiveTab: (tab: string) => void;
  onUpdateStatus?: (orderId: string, status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled') => void;
  onEditOrder?: (updatedOrder: WorkOrder) => void;
  onDeleteOrder?: (orderId: string) => void;
  themeStyle?: 'slate-modern' | 'cyber-cctv' | 'steel-teal' | 'solar-amber';
  onThemeStyleChange?: (theme: 'slate-modern' | 'cyber-cctv' | 'steel-teal' | 'solar-amber') => void;
}

type WorkspaceTheme = 'slate-modern' | 'cyber-cctv' | 'steel-teal' | 'solar-amber';

export default function CalendarView({ 
  orders, 
  technicians, 
  onSelectOrder, 
  setActiveTab,
  onUpdateStatus,
  onEditOrder,
  onDeleteOrder,
  themeStyle = 'slate-modern',
  onThemeStyleChange
}: CalendarViewProps) {
  // Use current local time 2026-05-30 as base
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-05-30T10:51:11Z'));
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-05-30');
  
  // Local wrapper helper to ensure fallback state works gracefully 
  const setThemeStyle = (themeName: WorkspaceTheme) => {
    if (onThemeStyleChange) {
      onThemeStyleChange(themeName);
    }
  };
  
  // Sidebar Tab: 'schedule' (focused for selected day) or 'running_plan' (global running list of tasks)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'schedule' | 'running_plan'>('schedule');

  // Inline editing states
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WorkOrder> | null>(null);
  
  // Inline deletion confirm safety gate
  const [deleteConfirmOrderId, setDeleteConfirmOrderId] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper arrays
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Format date helper: returns "YYYY-MM-DD" matching work order serviceDate format
  const formatDateStr = (dayNum: number): string => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Filter orders for local date range
  const getOrdersForDay = (dayNum: number): WorkOrder[] => {
    const formattedDate = formatDateStr(dayNum);
    return orders.filter(order => order.serviceDate === formattedDate && order.status !== 'Cancelled');
  };

  // Sort orders helper: places 'High' priority and 'In Progress' status at top
  const sortOrders = (orderArray: WorkOrder[]): WorkOrder[] => {
    return [...orderArray].sort((a, b) => {
      if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
      if (b.status === 'In Progress' && a.status !== 'In Progress') return 1;
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  };

  // Get active selected day orders
  const rawSelectedDayOrders = orders.filter(order => order.serviceDate === selectedDateStr && order.status !== 'Cancelled');
  const selectedDayOrders = sortOrders(rawSelectedDayOrders);

  // Get all active "running tasks" across the entire team (Pending or In Progress, not Completed / Cancelled)
  const rawRunningOrders = orders.filter(order => order.status === 'In Progress' || order.status === 'Pending');
  const runningOrders = sortOrders(rawRunningOrders);

  // Icon selector based on job categories
  const getJobIcon = (type: string) => {
    if (type.includes('CCTV')) return <Tv className="h-4 w-4 text-emerald-500" />;
    if (type.includes('Laptop')) return <Laptop className="h-4 w-4 text-sky-500" />;
    if (type.includes('PC')) return <Monitor className="h-4 w-4 text-blue-500" />;
    return <Shield className="h-4 w-4 text-slate-500" />;
  };

  const getPriorityColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'bg-rose-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-blue-500';
    }
  };

  const getPriorityTextClass = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
    }
  };

  // Get total tasks allocated to specific installer this active month
  const activeMonthOrders = orders.filter(o => {
    const oDate = new Date(o.serviceDate);
    return oDate.getFullYear() === year && oDate.getMonth() === month && o.status !== 'Cancelled';
  });

  const getTechnicianMonthlyLoad = (techId: string) => {
    return activeMonthOrders.filter(o => o.technicianId === techId).length;
  };

  // Action Click Handlers
  const handleMarkComplete = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateStatus) {
      onUpdateStatus(orderId, 'Completed');
    }
  };

  const handleToggleInProgress = (order: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateStatus) {
      const nextStatus = order.status === 'In Progress' ? 'Pending' : 'In Progress';
      onUpdateStatus(order.id, nextStatus);
    }
  };

  const startInlineEdit = (order: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrderId(order.id);
    setEditFormData({ ...order });
    setDeleteConfirmOrderId(null);
  };

  const cancelInlineEdit = () => {
    setEditingOrderId(null);
    setEditFormData(null);
  };

  const saveInlineEdit = () => {
    if (onEditOrder && editFormData && editingOrderId) {
      onEditOrder(editFormData as WorkOrder);
      setEditingOrderId(null);
      setEditFormData(null);
    }
  };

  const requestDelete = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmOrderId(orderId);
    setEditingOrderId(null);
  };

  const confirmDelete = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteOrder) {
      onDeleteOrder(orderId);
      setDeleteConfirmOrderId(null);
    }
  };

  // Theme styling configurations classes mapping
  const themeClasses = {
    'slate-modern': {
      outerBg: 'bg-slate-50/50',
      cardBg: 'bg-white border-slate-150',
      headerCardBg: 'bg-white border-slate-150',
      textMain: 'text-slate-900',
      textMuted: 'text-slate-550',
      borderLine: 'border-slate-100',
      calendarSelfDay: 'bg-slate-50/40 text-slate-900 border-slate-150 hover:bg-white',
      calendarSelected: 'bg-slate-950 text-white border-slate-950 shadow-sm',
      calendarToday: 'bg-emerald-50 text-slate-900 border-emerald-400 hover:bg-emerald-100/70',
      tabActive: 'bg-slate-950 text-white',
      tabInactive: 'bg-slate-100 text-slate-500 hover:bg-slate-200/70',
      badgeBorder: 'border-slate-200/80 bg-slate-50 text-slate-700',
    },
    'cyber-cctv': {
      outerBg: 'bg-slate-950',
      cardBg: 'bg-slate-900/90 border-slate-800 text-slate-150',
      headerCardBg: 'bg-slate-900 border-slate-800 text-slate-100',
      textMain: 'text-slate-100',
      textMuted: 'text-slate-400',
      borderLine: 'border-slate-800',
      calendarSelfDay: 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-850',
      calendarSelected: 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-cyan-900/20',
      calendarToday: 'bg-amber-950/40 text-amber-300 border-amber-500 hover:bg-amber-950/60',
      tabActive: 'bg-emerald-500 text-slate-950 font-bold',
      tabInactive: 'bg-slate-800 text-slate-400 hover:bg-slate-700',
      badgeBorder: 'border-slate-800 bg-slate-950 text-emerald-400',
    },
    'steel-teal': {
      outerBg: 'bg-teal-50/40',
      cardBg: 'bg-white border-teal-150/85',
      headerCardBg: 'bg-white border-teal-150',
      textMain: 'text-slate-900',
      textMuted: 'text-teal-700/70',
      borderLine: 'border-teal-50',
      calendarSelfDay: 'bg-teal-50/10 text-slate-800 border-teal-100 hover:bg-white',
      calendarSelected: 'bg-teal-700 text-white border-teal-750 shadow-md',
      calendarToday: 'bg-sky-50 text-slate-900 border-sky-400 hover:bg-sky-100',
      tabActive: 'bg-teal-700 text-white',
      tabInactive: 'bg-slate-150/70 text-slate-600 hover:bg-slate-250',
      badgeBorder: 'border-teal-100 bg-teal-50/50 text-teal-800',
    },
    'solar-amber': {
      outerBg: 'bg-[#faf6f0]',
      cardBg: 'bg-white border-amber-200 text-[#3c2a15]',
      headerCardBg: 'bg-white border-amber-200',
      textMain: 'text-[#3c2a15]',
      textMuted: 'text-[#785429]',
      borderLine: 'border-amber-100/60',
      calendarSelfDay: 'bg-[#faf6f0]/50 text-[#3c2a15] border-amber-100 hover:bg-white',
      calendarSelected: 'bg-amber-800 text-white border-amber-800 shadow-md',
      calendarToday: 'bg-emerald-55 bg-emerald-50 text-slate-900 border-emerald-400 hover:bg-emerald-100/70',
      tabActive: 'bg-amber-800 text-white',
      tabInactive: 'bg-[#faf6f0] text-amber-800 hover:bg-[#eae0d0]',
      badgeBorder: 'border-amber-100 bg-amber-50 text-amber-800',
    }
  };

  const activeTheme = themeClasses[themeStyle] || themeClasses['slate-modern'];

  return (
    <div className={`space-y-6 p-1 rounded-2xl transition-all duration-300 ${activeTheme.outerBg}`}>
      
      {/* Dynamic Workspace Header & Theme Controller Panel */}
      <div className={`p-5 rounded-2xl border shadow-3xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all duration-300 ${activeTheme.headerCardBg}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-bold uppercase rounded-md tracking-wider">
              Installed Task Hub
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-mono">
              <Sparkles className="h-3 w-3" />
              <span>Workspace layout customizer configured</span>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 mt-1.5">
            <CalendarIcon className="h-5.5 w-5.5 text-blue-500" />
            CCTV & Tech Operations Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch planner for <strong>Sabbir Rahman, Shimol, Salman, and S.M. Salman</strong>. Check monthly allocations, edit schedules, and complete installations in real time.
          </p>
        </div>

        {/* Custom Layout Theme Switcher Panel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200/50 dark:border-slate-805">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase px-2">
            LAYOUT TYPE:
          </span>
          <div className="flex flex-wrap bg-slate-250 dark:bg-slate-900 p-0.5 rounded-lg gap-1">
            <button
              onClick={() => setThemeStyle('slate-modern')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all duration-150 ${
                themeStyle === 'slate-modern' 
                  ? 'bg-white text-slate-900 shadow-3xs' 
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              🌞 Slate-Modern
            </button>
            <button
              onClick={() => setThemeStyle('cyber-cctv')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all duration-150 ${
                themeStyle === 'cyber-cctv' 
                  ? 'bg-[#10b981] text-slate-950 shadow-3xs' 
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              🌑 Cyber-CCTV
            </button>
            <button
              onClick={() => setThemeStyle('steel-teal')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all duration-150 ${
                themeStyle === 'steel-teal' 
                  ? 'bg-teal-750 text-white shadow-3xs' 
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              🌐 Steel-Teal
            </button>
            <button
              onClick={() => setThemeStyle('solar-amber')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all duration-150 ${
                themeStyle === 'solar-amber' 
                  ? 'bg-amber-800 text-white shadow-3xs' 
                  : 'text-slate-555 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              🍁 Solar-Amber
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Calendar on Left, Selection List and Team Load on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Complete Monthly Calendar Grid */}
        <div className={`lg:col-span-8 rounded-2xl border p-5 shadow-3xs flex flex-col justify-between transition-all duration-300 ${activeTheme.cardBg}`}>
          <div>
            {/* Header: Month switcher */}
            <div className={`flex items-center justify-between mb-6 pb-4 border-b ${activeTheme.borderLine}`}>
              <span className="text-sm font-mono font-bold text-slate-400 tracking-wider">
                {year}
              </span>
              <h2 className="text-lg font-bold font-sans tracking-tight">
                {monthNames[month]}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-855 transition-colors border border-slate-200/60 dark:border-slate-800"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-855 transition-colors border border-slate-200/60 dark:border-slate-800"
                  aria-label="Next Month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid Header (Weeks) */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {weekDays.map((day) => (
                <div key={day} className="text-[10px] font-mono font-bold text-slate-400 uppercase py-1.5">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Padding empty slots for start of month offsets */}
              {Array.from({ length: firstDayIndex }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[82px] bg-slate-55/10 dark:bg-slate-900/40 rounded-xl" />
              ))}

              {/* Monthly active days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNum = index + 1;
                const dateStr = formatDateStr(dayNum);
                const isSelected = selectedDateStr === dateStr;
                const isToday = dateStr === '2026-05-30';
                const dayOrders = getOrdersForDay(dayNum);

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => {
                      setSelectedDateStr(dateStr);
                      setActiveSidebarTab('schedule'); // Autofocus the schedule view for that day
                      setEditingOrderId(null); // Reset edit state to prevent confusion
                    }}
                    className={`min-h-[85px] p-2 flex flex-col justify-between text-left transition-all duration-150 rounded-xl border relative focus:outline-none ${
                      isSelected 
                        ? activeTheme.calendarSelected
                        : isToday
                          ? activeTheme.calendarToday
                          : activeTheme.calendarSelfDay
                    }`}
                  >
                    {/* Day number */}
                    <span className="text-xs font-mono font-bold">
                      {dayNum}
                    </span>

                    {/* Indicators list rendering */}
                    <div className="w-full flex flex-col gap-1 mt-1.5">
                      {/* Show visual dots */}
                      {dayOrders.length > 0 && (
                        <div className="flex flex-wrap gap-1 leading-none mt-auto">
                          {dayOrders.slice(0, 3).map((order) => (
                            <div 
                              key={order.id} 
                              className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)}`}
                              title={`${order.jobType} (${order.priority})`}
                            />
                          ))}
                          {dayOrders.length > 3 && (
                            <span className="text-[8px] font-mono leading-none text-slate-400 dark:text-slate-500">
                              +{dayOrders.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Micro inline label on desktop scale */}
                      {dayOrders.length > 0 && (
                        <div className="hidden sm:block mt-1 space-y-0.5">
                          {dayOrders.slice(0, 2).map(order => (
                            <div 
                              key={order.id} 
                              className={`text-[8px] font-mono leading-tight px-1 py-0.5 rounded truncate max-w-full ${
                                isSelected 
                                  ? 'bg-black/25 text-white' 
                                  : 'bg-white/80 text-slate-705 dark:bg-slate-800 dark:text-slate-300 border border-slate-100/30'
                              }`}
                            >
                              {order.jobType.split(' ')[0]} - {order.customerName.split(' ')[0]}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick priority legend */}
          <div className={`mt-6 pt-4 border-t ${activeTheme.borderLine} flex flex-wrap items-center justify-between gap-2.5 text-[10px] text-slate-500 font-mono tracking-wide uppercase`}>
            <span className="font-bold">PRIORITY FEED:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> High Importance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Importance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Standard Low
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Combined Tabular Sidebar Panel (Schedule OR Running Tasks Side Plan, plus actions) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Control Panel: Toggles between Specific Date tasks & Global Running Order list */}
          <div className={`rounded-2xl border p-5 shadow-3xs transition-all duration-300 ${activeTheme.cardBg}`}>
            
            {/* Integrated Tab Controller */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl gap-1 mb-5 border border-slate-205/30 dark:border-slate-800">
              <button
                onClick={() => {
                  setActiveSidebarTab('schedule');
                  setEditingOrderId(null);
                }}
                className={`flex-1 py-2 text-center text-xs font-mono font-bold rounded-lg transition-all duration-150 ${
                  activeSidebarTab === 'schedule'
                    ? activeTheme.tabActive
                    : activeTheme.tabInactive
                }`}
              >
                📅 Selected ({selectedDayOrders.length})
              </button>
              <button
                onClick={() => {
                  setActiveSidebarTab('running_plan');
                  setEditingOrderId(null);
                }}
                className={`flex-1 py-2 text-center text-xs font-mono font-bold rounded-lg transition-all duration-150 ${
                  activeSidebarTab === 'running_plan'
                    ? activeTheme.tabActive
                    : activeTheme.tabInactive
                }`}
              >
                ⚡ Running Plan ({runningOrders.length})
              </button>
            </div>

            {/* Render Tab Contents */}
            {activeSidebarTab === 'schedule' ? (
              // Selected Date Schedule Render
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/50 dark:border-slate-800/80 mb-4">
                  <h3 className="font-bold text-xs tracking-tight uppercase font-mono text-emerald-600 dark:text-emerald-400">
                    Day Schedule
                  </h3>
                  <div className={`text-[10px] px-2.5 py-1 rounded-md font-mono font-bold ${activeTheme.badgeBorder}`}>
                    {selectedDateStr}
                  </div>
                </div>

                {selectedDayOrders.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-400 mb-3 border border-slate-150 dark:border-slate-800">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 tracking-tight">
                      No Scheduled Jobs
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      No laptops to fix, PCs to deploy, or cameras to string on this date.
                    </p>
                    <button
                      onClick={() => setActiveTab('new-order')}
                      className="mt-4 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-white rounded-lg text-[10px] font-mono font-bold tracking-wider"
                    >
                      + ADD DIRECT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                    {selectedDayOrders.map((order) => (
                      <div key={order.id}>
                        {renderingWorkOrderCard(order)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Running Plan Render (Pending/In Progress globally)
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/50 dark:border-slate-804 mb-4">
                  <h3 className="font-bold text-xs tracking-tight uppercase font-mono text-blue-600 dark:text-blue-400">
                    All Active Tech Tasks
                  </h3>
                  <div className={`text-[10px] px-2.5 py-1 rounded-md font-mono font-bold ${activeTheme.badgeBorder}`}>
                    Live Queue
                  </div>
                </div>

                {runningOrders.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-400 mb-3 border border-slate-150/50 dark:border-slate-800">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-350 tracking-tight">
                      All Caught Up!
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      No pending or running jobs. Excellent coordination!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                    {runningOrders.map((order) => (
                      <div key={order.id}>
                        {renderingWorkOrderCard(order)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Section: Active Service Team Load summary */}
          <div className={`rounded-2xl border p-5 shadow-3xs transition-all duration-300 ${activeTheme.cardBg}`}>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight font-sans pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-1.5">
              <UserCheck className="h-4.5 w-4.5 text-blue-500" />
              Monthly Tech Allocations
            </h3>
            
            <div className="space-y-3.5">
              {technicians.map((tech) => {
                const load = getTechnicianMonthlyLoad(tech.id);
                const percent = Math.min((load / 10) * 100, 100);

                return (
                  <div key={tech.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-5.5 h-5.5 bg-slate-900 text-emerald-400 text-[10px] font-bold rounded-md flex items-center justify-center">
                          {tech.avatar}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{tech.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {load} {load === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>

                    {/* Progress Bar styled according to current theme */}
                    <div className="w-full bg-slate-150 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          tech.id === 'tech-1' 
                            ? 'bg-blue-500' 
                            : percent > 60 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent || 4}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );

  // DRY renderer function for WorkOrder card and form representation in sidebar
  function renderingWorkOrderCard(order: WorkOrder) {
    const tech = technicians.find((t) => t.id === order.technicianId);
    const isEditing = editingOrderId === order.id;
    const isConfirmingDelete = deleteConfirmOrderId === order.id;

    // 1. INLINE EDITOR STATE RENDER
    if (isEditing && editFormData) {
      return (
        <div className="p-4 border-2 border-emerald-500 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xxs font-mono font-bold text-slate-400">
              EDITING TASK {order.id}
            </span>
            <button 
              onClick={cancelInlineEdit}
              className="p-1 text-slate-450 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Job Type input selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              Job Category:
            </label>
            <select
              value={editFormData.jobType || 'CCTV Installation'}
              onChange={(e) => setEditFormData({ ...editFormData, jobType: e.target.value as any })}
              className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 rounded-lg p-2 font-sans font-bold"
            >
              <option value="CCTV Installation">🎥 CCTV Installation</option>
              <option value="CCTV Service">🛠️ CCTV Service</option>
              <option value="Laptop Service">💻 Laptop Service</option>
              <option value="PC Service">🖥️ PC Service</option>
              <option value="Installation">📦 Generic Installation</option>
              <option value="Troubleshooting">🩺 Generic Troubleshooting</option>
              <option value="Upgrades">🚀 Upgrades</option>
              <option value="Maintenance">🧹 Maintenance</option>
            </select>
          </div>

          {/* Installer allocation dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              Assigned Installer:
            </label>
            <select
              value={editFormData.technicianId || 'unassigned'}
              onChange={(e) => setEditFormData({ ...editFormData, technicianId: e.target.value })}
              className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 rounded-lg p-2 font-sans"
            >
              <option value="unassigned">⚠️ Unassigned Standby</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  🛠️ {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Date & time block */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Date:
              </label>
              <input
                type="date"
                value={editFormData.serviceDate || ''}
                onChange={(e) => setEditFormData({ ...editFormData, serviceDate: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 p-2 rounded-lg font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Time Slot:
              </label>
              <select
                value={editFormData.timeSlot || '09:00 AM - 11:30 AM'}
                onChange={(e) => setEditFormData({ ...editFormData, timeSlot: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 p-2 rounded-lg"
              >
                <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM</option>
                <option value="11:30 AM - 02:00 PM">11:30 AM - 02:00 PM</option>
                <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM</option>
                <option value="04:30 PM - 07:00 PM">04:30 PM - 07:05 PM</option>
              </select>
            </div>
          </div>

          {/* Task Description string */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              Job Description:
            </label>
            <textarea
              rows={2}
              value={editFormData.description || ''}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-355 dark:border-slate-805 p-2 rounded-lg font-sans"
              placeholder="List equipment details"
            />
          </div>

          {/* Priority allocation */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Priority:
              </label>
              <select
                value={editFormData.priority || 'Medium'}
                onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as any })}
                className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 p-2 rounded-lg font-bold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Status:
              </label>
              <select
                value={editFormData.status || 'Pending'}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 p-2 rounded-lg font-bold"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              Client Name:
            </label>
            <input
              type="text"
              value={editFormData.customerName || ''}
              onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
              className="w-full text-xs bg-white dark:bg-slate-950 dark:text-white border border-slate-350 dark:border-slate-800 p-2 rounded-lg"
            />
          </div>

          {/* Controls button actions footer */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={saveInlineEdit}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold"
            >
              SAVE UPDATES
            </button>
            <button
              onClick={cancelInlineEdit}
              className="px-3 py-1.5 bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg text-xs font-mono"
            >
              CANCEL
            </button>
          </div>
        </div>
      );
    }

    // 2. CONFIRM DELETE STATE RENDER (Popup safety replacement)
    if (isConfirmingDelete) {
      return (
        <div className="p-4 border-2 border-rose-500 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-bold text-xs uppercase font-mono">
              CONFIRM DELETION
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-305">
            Are you sure you want to permanently delete task <strong>{order.id}</strong> (for client {order.customerName})? This cannot be undone.
          </p>
          <div className="flex gap-2 pt-0.5">
            <button
              onClick={(e) => confirmDelete(order.id, e)}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold"
            >
              YES, DELETE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmOrderId(null);
              }}
              className="px-4 py-1.5 bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg text-xs font-mono"
            >
              KEEP IT
            </button>
          </div>
        </div>
      );
    }

    // 3. SECURE WORK ORDER PREVIEW RENDER
    return (
      <div 
        onClick={() => onSelectOrder(order.id)}
        className="group p-3 border border-slate-105 dark:border-slate-800 rounded-xl bg-slate-50/10 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all duration-150 relative"
      >
        {/* Priority Badge absolute wrapper */}
        <span className={`absolute top-2.5 right-2.5 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${getPriorityTextClass(order.priority)}`}>
          {order.priority}
        </span>

        {/* Card Category Header */}
        <div className="flex items-start gap-1.5 pr-14">
          {getJobIcon(order.jobType)}
          <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-wider py-0.5">
            {order.id}
          </span>
          {order.status === 'Completed' ? (
            <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1 py-0.2 rounded">
              COMPLETED
            </span>
          ) : order.status === 'In Progress' ? (
            <span className="text-[8px] bg-blue-105 dark:bg-blue-950 text-blue-900 dark:text-blue-300 font-bold px-1 py-0.2 rounded animate-pulse">
              IN PROGRESS
            </span>
          ) : (
            <span className="text-[8px] bg-slate-100 dark:bg-slate-950 text-slate-705 dark:text-slate-400 font-mono font-bold px-1 py-0.2 rounded">
              PENDING
            </span>
          )}
        </div>

        {/* Client & Description */}
        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-blue-600 transition-colors">
          {order.jobType}
        </h4>
        <p className="text-[11px] font-medium text-slate-650 dark:text-slate-300 mt-0.5">
          👤 {order.customerName}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {order.description}
        </p>

        {/* Context stats and interactive action row */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-105 dark:border-slate-800/80 flex flex-col gap-2.5">
          
          {/* Allocation details row */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            {/* Date Tag */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="font-semibold">{order.serviceDate} ({order.timeSlot.split(' - ')[0]})</span>
            </div>

            {/* Allocated tech tag */}
            <div className="flex items-center gap-1 font-bold">
              <div className="w-3.5 h-3.5 bg-slate-900 dark:bg-slate-800 text-emerald-450 dark:text-emerald-400 rounded-full flex items-center justify-center text-[8px]">
                {tech ? tech.avatar : '?'}
              </div>
              <span className={tech ? 'text-slate-700 dark:text-slate-350' : 'text-slate-450 italic'}>
                {tech ? tech.name.split(' ')[0] : 'Standby'}
              </span>
            </div>
          </div>

          {/* Quick interactive utility action panel */}
          <div className="flex items-center gap-1.5 mt-1 border-t border-dashed border-slate-105 dark:border-slate-800 pt-2.5">
            
            {/* Toggle Status (Pending / In Progress) */}
            {order.status !== 'Completed' && (
              <button
                onClick={(e) => handleToggleInProgress(order, e)}
                title={order.status === 'In Progress' ? "Pause Task to Pending" : "Start Task In Progress"}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-colors ${
                  order.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 hover:bg-emerald-100'
                }`}
              >
                <Play className="h-2.5 w-2.5" />
                <span>{order.status === 'In Progress' ? 'PAUSE' : 'START'}</span>
              </button>
            )}

            {/* Quick Complete trigger */}
            {order.status !== 'Completed' && (
              <button
                onClick={(e) => handleMarkComplete(order.id, e)}
                title="Mark this Task Completed"
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-mono font-bold transition-colors shadow-3xs"
              >
                <Check className="h-2.5 w-2.5" />
                <span>COMPLETE</span>
              </button>
            )}

            {/* Quick Editor Access */}
            <button
              onClick={(e) => startInlineEdit(order, e)}
              title="Edit Task Details Inline"
              className="ml-auto p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-205 dark:bg-slate-850 dark:text-slate-400 hover:text-white rounded transition-colors border border-slate-200/50 dark:border-slate-800"
            >
              <Edit2 className="h-3 w-3" />
            </button>

            {/* Quick Deletion Access */}
            <button
              onClick={(e) => requestDelete(order.id, e)}
              title="Delete Task Permanently"
              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-450 hover:text-rose-300 rounded transition-colors border border-rose-100/30"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

        </div>

      </div>
    );
  }
}

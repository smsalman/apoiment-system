import React from 'react';
import { Technician, WorkOrder } from '../types';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  Star, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface TechniciansListProps {
  technicians: Technician[];
  orders: WorkOrder[];
  onUpdateStatus: (techId: string, status: 'Available' | 'On Site' | 'Offline') => void;
  onSelectOrder: (orderId: string) => void;
  themeStyle?: 'slate' | 'cyber' | 'steel' | 'solar';
}

export default function TechniciansList({ technicians, orders, onUpdateStatus, onSelectOrder, themeStyle = 'slate' }: TechniciansListProps) {
  // Unified visual adjustments depending on themeStyle choice
  const config = {
    slate: {
      card: "bg-white border border-slate-150 shadow-xs text-slate-900",
      boardHeader: "bg-slate-900 text-white shadow-lg",
      headerTag: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
      textDark: "text-slate-900",
      textMuted: "text-slate-500",
      pill: "bg-slate-50 text-slate-700 border border-slate-100",
      subtleCard: "bg-slate-50 border border-slate-100",
      divider: "divide-slate-100",
      borderLine: "border-slate-100",
    },
    cyber: {
      card: "bg-slate-900 border border-slate-800 text-slate-100 shadow-md",
      boardHeader: "bg-slate-950 border border-[#10b981]/20 text-slate-100 shadow-xl",
      headerTag: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono",
      textDark: "text-[#10b981] font-mono",
      textMuted: "text-slate-400 font-mono",
      pill: "bg-slate-950 text-slate-300 border border-slate-850",
      subtleCard: "bg-slate-950/60 border border-slate-850",
      divider: "divide-slate-850",
      borderLine: "border-slate-800",
    },
    steel: {
      card: "bg-white border border-teal-150/90 text-slate-900 shadow-sm",
      boardHeader: "bg-teal-900 text-teal-100 shadow-md",
      headerTag: "bg-teal-500/25 text-teal-200 border border-teal-600/35",
      textDark: "text-teal-950",
      textMuted: "text-teal-800/80",
      pill: "bg-teal-50 text-teal-950 border border-teal-100",
      subtleCard: "bg-teal-50/20 border border-teal-100/60",
      divider: "divide-teal-50",
      borderLine: "border-teal-100",
    },
    solar: {
      card: "bg-white border border-amber-205/85 text-amber-950 shadow-2xs",
      boardHeader: "bg-[#2d1c0c] text-amber-50 border border-[#3d2714]",
      headerTag: "bg-[#3d2714] text-amber-250 border border-amber-900/30",
      textDark: "text-[#2d1c0c] font-bold",
      textMuted: "text-[#785429]",
      pill: "bg-[#faf6f0] text-amber-900 border border-[#eae0d0]",
      subtleCard: "bg-[#faf6f0] border border-amber-100/60",
      divider: "divide-amber-100/60",
      borderLine: "border-amber-100/60",
    }
  }[themeStyle] || {
    card: "bg-white border border-slate-100 shadow-3xs text-slate-900",
    boardHeader: "bg-slate-900 text-white shadow-xl",
    headerTag: "bg-indigo-505 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    textDark: "text-slate-900",
    textMuted: "text-slate-555",
    pill: "bg-slate-55 bg-slate-50 text-slate-705 border border-slate-100",
    subtleCard: "bg-slate-55 bg-slate-50 border border-slate-100",
    divider: "divide-slate-100",
    borderLine: "border-slate-100",
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Visual Title Header */}
      <div className={`rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden transition-all duration-300 ${config.boardHeader}`}>
        <div className="space-y-1">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 border rounded-full ${config.headerTag}`}>
            Field Personnel Status Board
          </span>
          <h2 className="font-bold text-lg">Servicemen Crew Registry</h2>
          <p className="text-xs opacity-75">Manage real-time field statuses, skills matrices, and active routes.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-5">
          <ShieldCheck className="w-32 h-32 text-indigo-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicians.map((tech) => {
          // Find assignments assigned to this technician
          const techJobs = orders.filter(o => o.technicianId === tech.id);
          const activeJobs = techJobs.filter(o => o.status === 'In Progress' || o.status === 'Pending');
          const completedJobs = techJobs.filter(o => o.status === 'Completed');

          return (
            <div 
              key={tech.id} 
              className={`rounded-2xl p-5 md:p-6 space-y-5 flex flex-col justify-between transition-all duration-300 ${config.card}`}
            >
              {/* Profile details & Quick status toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white font-mono text-base font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {tech.avatar}
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`font-bold text-sm sm:text-base leading-none transition-all duration-300 ${config.textDark}`}>{tech.name}</h4>
                      <div className="flex items-center gap-0.5 text-amber-500 font-mono text-[11px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{tech.rating}</span>
                      </div>
                    </div>
                    <div className={`text-xs font-mono flex items-center gap-1 transition-all duration-300 ${config.textMuted}`}>
                      <Phone className="w-3 h-3 opacity-60" />
                      <span>{tech.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                    tech.status === 'Available'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : tech.status === 'On Site'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {tech.status}
                  </span>
                </div>
              </div>

              {/* Skills Area */}
              <div className="text-left space-y-1.5">
                <div className={`text-[10px] uppercase font-bold font-mono tracking-wider transition-all duration-300 ${config.textMuted}`}>Installer Skills Matrix</div>
                <div className="flex flex-wrap gap-1">
                  {tech.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className={`text-[10px] px-2 py-0.5 font-mono rounded border transition-all duration-300 ${config.pill}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assignments / Live active dispatch lines */}
              <div className={`rounded-xl p-3 text-left space-y-2 flex-1 flex flex-col justify-between border transition-all duration-300 ${config.subtleCard}`}>
                <div>
                  <div className={`flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wide mb-1.5 transition-all duration-300 ${config.textMuted}`}>
                    <span>Active Route Run ({activeJobs.length})</span>
                    <span className="opacity-75">{completedJobs.length} Completed Runs</span>
                  </div>

                  {activeJobs.length === 0 ? (
                    <div className="py-3 px-1 text-center text-xs opacity-60 italic">
                      No current installations assigned today. Available for deployment!
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {activeJobs.map((job) => (
                        <div 
                          key={job.id} 
                          onClick={() => onSelectOrder(job.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border hover:border-emerald-500/65 transition cursor-pointer text-xs bg-black/5 dark:bg-black/25 ${config.borderLine}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold opacity-60 text-[10px]">{job.id}</span>
                            <span className="truncate font-semibold">{job.customerName}</span>
                          </div>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            job.status === 'In Progress' 
                              ? 'bg-blue-500/10 text-blue-400' 
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Direct dispatcher dispatch actions (interactive trigger status updates!) */}
              <div className={`border-t pt-3 flex flex-col sm:flex-row gap-2 items-center justify-between transition-all duration-300 ${config.borderLine}`}>
                <span className={`text-[10px] font-mono transition-all duration-300 ${config.textMuted}`}>Live Status Dispatcher Control:</span>
                <div className={`flex gap-1 p-0.5 rounded-lg w-full sm:w-auto transition-all duration-300 ${config.pill}`}>
                  {(['Available', 'On Site', 'Offline'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateStatus(tech.id, s)}
                      className={`flex-1 sm:flex-none text-[9px] uppercase font-mono tracking-wider px-2 py-1 rounded-md transition ${
                        tech.status === s 
                          ? s === 'Available'
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                            : s === 'On Site'
                            ? 'bg-blue-500 text-white font-bold shadow-xs'
                            : 'bg-slate-600 text-white font-bold shadow-xs'
                          : 'opacity-60 hover:opacity-100 dark:hover:bg-white/10 hover:bg-black/5'
                      }`}
                    >
                      {s.split(' ')[0]} {/* shortened */}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

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
}

export default function TechniciansList({ technicians, orders, onUpdateStatus, onSelectOrder }: TechniciansListProps) {
  return (
    <div className="space-y-6 pb-24">
      {/* Visual Title Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full uppercase tracking-wider">
            Field Personnel Status Board
          </span>
          <h2 className="font-bold text-lg">Servicemen Crew Registry</h2>
          <p className="text-xs text-slate-400">Manage real-time field statuses, skills matrices, and active routes.</p>
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
              className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 md:p-6 space-y-5 flex flex-col justify-between"
            >
              {/* Profile details & Quick status toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white font-mono text-base font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {tech.avatar}
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-none">{tech.name}</h4>
                      <div className="flex items-center gap-0.5 text-amber-500 font-mono text-[11px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{tech.rating}</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{tech.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                    tech.status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : tech.status === 'On Site'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {tech.status}
                  </span>
                </div>
              </div>

              {/* Skills Area */}
              <div className="text-left space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Installer Skills Matrix</div>
                <div className="flex flex-wrap gap-1">
                  {tech.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="bg-slate-50 text-slate-700 border border-slate-100 text-[10px] px-2 py-0.5 font-mono rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assignments / Live active dispatch lines */}
              <div className="bg-slate-50 rounded-xl p-3 text-left space-y-2 border border-slate-100 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    <span>Active Route Run ({activeJobs.length})</span>
                    <span className="text-slate-400">{completedJobs.length} Completed Runs</span>
                  </div>

                  {activeJobs.length === 0 ? (
                    <div className="py-3 px-1 text-center text-xs text-slate-400 italic">
                      No current installations assigned today. Available for deployment!
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {activeJobs.map((job) => (
                        <div 
                          key={job.id} 
                          onClick={() => onSelectOrder(job.id)}
                          className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 transition shadow-3xs cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-slate-400 text-[10px]">{job.id}</span>
                            <span className="truncate font-semibold text-slate-700">{job.customerName}</span>
                          </div>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            job.status === 'In Progress' 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-amber-50 text-amber-600'
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
              <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row gap-2 items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">Live Status Dispatcher Control:</span>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full sm:w-auto">
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
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
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

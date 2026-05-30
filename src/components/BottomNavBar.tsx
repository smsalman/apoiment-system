import React from 'react';
import { Home, ClipboardList, Plus, Users, Calendar } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export default function BottomNavBar({ activeTab, setActiveTab, pendingCount }: BottomNavBarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: Home },
    { id: 'orders', label: 'Work Orders', icon: ClipboardList, badge: pendingCount },
    { id: 'new-order', label: 'New Job', icon: Plus, isCenter: true },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'technicians', label: 'Service Team', icon: Users },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 z-50 px-4 py-2 sm:py-3 shadow-2xl safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center -mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-4 rounded-full shadow-lg border-4 border-slate-900 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none`}
                aria-label="Create New Work Order"
              >
                <Icon className="h-6 w-6 stroke-[3]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors duration-150 focus:outline-none ${
                isActive ? 'text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-wide uppercase font-mono">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-[-6px] w-6 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

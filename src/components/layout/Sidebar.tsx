import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  BrainCircuit, 
  Settings, 
  ChevronRight
} from 'lucide-react';
import { ViewType } from '../../types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    meetings, 
    memories,
    contacts,
    setIsEditProfileOpen
  } = useApp();

  const todayMeetingsCount = meetings.filter((m) => m.isToday).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'meetings',
      label: 'Meetings',
      icon: CalendarDays,
      badge: todayMeetingsCount > 0 ? `${todayMeetingsCount} today` : undefined,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      badge: contacts.length > 0 ? contacts.length : undefined,
    },
    {
      id: 'memory',
      label: 'Memory',
      icon: BrainCircuit,
      badge: memories.length > 0 ? memories.length : undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-colors duration-200">
      {/* Top brand header */}
      <div>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  MeetMind <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">
                Meeting Prep & Memory
              </p>
            </div>
          </div>
        </div>

        {/* Clean Nav links with Animated Micro-Interactions (Requirement 14) */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'contacts' && currentView === 'contact-details') ||
              (item.id === 'meetings' && currentView === 'meeting-prep') ||
              (item.id === 'memory' && currentView === 'update-memory');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 hover:shadow-xs'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:translate-x-0.5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]'
                        : 'text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]'
                    }`}
                  />
                  <span className="transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                    {item.label}
                  </span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom user profile & memory status */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Subtle Memory Engine Status */}
        <div className="px-3 py-2 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Memory Engine</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Ready</span>
        </div>

        {/* User Card */}
        <div 
          onClick={() => setCurrentView('settings')}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center ring-1 ring-indigo-400/30">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            )}
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.company}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

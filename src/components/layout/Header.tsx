import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sun, 
  Moon, 
  Sparkles, 
  CalendarPlus,
  Clock
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    setCurrentView,
    setIsCommandMenuOpen,
    setIsAddMeetingOpen,
    setIsAddMemoryOpen,
    meetings
  } = useApp();

  const todayMeetingsCount = meetings.filter((m) => m.isToday).length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between transition-colors">
      {/* Left: Quick search / command bar trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <button
          onClick={() => setIsCommandMenuOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 rounded-lg transition-all group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200" />
            <span className="truncate">Search contacts, memories, upcoming meetings...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Date, status, theme toggle, primary actions */}
      <div className="flex items-center gap-3">
        {/* Meeting counter indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-slate-900 dark:text-slate-100 font-semibold">{todayMeetingsCount}</span> meetings scheduled today
          </span>
        </div>

        {/* Action: Return to Landing Page */}
        <button
          onClick={() => setCurrentView('landing')}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 transition-all cursor-pointer hidden md:inline-flex items-center gap-1.5"
          title="Return to MeetMind AI Landing Page"
        >
          <span>Landing Page</span>
        </button>

        {/* Action: Quick add meeting */}
        <Button
          variant="secondary"
          size="sm"
          icon={<CalendarPlus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
          onClick={() => setIsAddMeetingOpen(true)}
          className="hidden sm:inline-flex"
        >
          Add Meeting
        </Button>

        {/* Action: Update Memory */}
        <Button
          variant="primary"
          size="sm"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={() => setCurrentView('update-memory')}
        >
          Update Memory
        </Button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Users, 
  CalendarDays, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight,
  X
} from 'lucide-react';

export const CommandMenu: React.FC = () => {
  const { 
    isCommandMenuOpen, 
    setIsCommandMenuOpen, 
    contacts, 
    meetings, 
    memories,
    navigateToContact,
    navigateToMeetingPrep,
    setCurrentView,
    setIsAddMemoryOpen,
    setIsAddMeetingOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandMenuOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandMenuOpen]);

  const handleClose = () => {
    setQuery('');
    setIsCommandMenuOpen(false);
  };

  if (!isCommandMenuOpen) return null;

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.company.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredMeetings = meetings.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.contactName.toLowerCase().includes(query.toLowerCase()) ||
    m.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredMemories = memories.filter((m) =>
    m.content.toLowerCase().includes(query.toLowerCase()) ||
    m.contactName.toLowerCase().includes(query.toLowerCase()) ||
    (m.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-float border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a contact, meeting, or memory..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Quick Actions
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => {
                    setIsCommandMenuOpen(false);
                    setIsAddMemoryOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Capture New Memory
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setIsCommandMenuOpen(false);
                    setIsAddMeetingOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group"
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-500" />
                    Schedule New Meeting
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Meetings */}
          {filteredMeetings.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Meetings
              </div>
              <div className="space-y-1 mt-1">
                {filteredMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      navigateToMeetingPrep(m.id);
                      setIsCommandMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.contactName} • {m.startTime} ({m.date})
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50 shrink-0">
                      Prepare Me
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {filteredContacts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Contacts
              </div>
              <div className="space-y-1 mt-1">
                {filteredContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      navigateToContact(c.id);
                      setIsCommandMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {c.role} at {c.company}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      View Dossier →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Memories */}
          {filteredMemories.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Memories & Intel
              </div>
              <div className="space-y-1 mt-1">
                {filteredMemories.map((mem) => (
                  <button
                    key={mem.id}
                    onClick={() => {
                      setCurrentView('memory');
                      setIsCommandMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <BrainCircuit className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                        {mem.content}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {mem.contactName} ({mem.contactCompany})
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredContacts.length === 0 && filteredMeetings.length === 0 && filteredMemories.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              No results found for "{query}". Try searching by name, company or topic.
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press ESC to close</span>
          <span>MeetMind Context Engine v2.4</span>
        </div>
      </div>
    </div>
  );
};

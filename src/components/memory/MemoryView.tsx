import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BrainCircuit, 
  Search, 
  Plus, 
  Pin, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Sliders, 
  Briefcase, 
  Calendar, 
  AlertTriangle,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AIMemoryGraph } from './AIMemoryGraph';

type MemoryTabFilter = 
  | 'all' 
  | 'meetings' 
  | 'decisions' 
  | 'commitments' 
  | 'action_items' 
  | 'preferences' 
  | 'unresolved_issues';

export const MemoryView: React.FC = () => {
  const { 
    memories, 
    contacts, 
    meetings,
    commitments,
    setIsAddMemoryOpen, 
    togglePinMemory, 
    deleteMemory, 
    navigateToContact 
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<MemoryTabFilter>('all');

  // Categorized records mapping
  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.contactName.toLowerCase().includes(search.toLowerCase()) ||
      m.contactCompany.toLowerCase().includes(search.toLowerCase()) ||
      (m.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'decisions') return m.category === 'decision';
    if (activeTab === 'preferences') return m.category === 'preference';
    if (activeTab === 'commitments') return m.category === 'commitment';
    return true;
  });

  // Previous meetings list for "Previous meetings" filter
  const previousMeetings = meetings.filter((m) => {
    if (!search) return true;
    return (
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.contactName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Action items / commitments for "Action items" & "Commitments" filter
  const actionItems = commitments.filter((c) => {
    if (!search) return true;
    return (
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Extract unresolved issues from contacts
  const allUnresolvedIssues = contacts.flatMap((c) =>
    (c.knownConcerns || [])
      .filter((kc) => kc.status === 'active')
      .map((kc) => ({
        id: kc.id,
        title: kc.title,
        description: kc.description,
        severity: kc.severity,
        contactName: c.name,
        company: c.company,
        contactId: c.id
      }))
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Meeting Memory
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Hindsight Architecture Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Important context from your meetings, decisions and commitments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddMemoryOpen(true)}
        >
          Capture Memory
        </Button>
      </div>

      {/* Primary Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search your meeting history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* AI Memory Visualization (Requirement 11) */}
      <section className="space-y-3">
        <AIMemoryGraph />
      </section>

      {/* Filter Tabs for Structure Specified in Requirement 7 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Recent memories
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          {[
            { id: 'all', label: 'All Recent' },
            { id: 'meetings', label: 'Previous meetings' },
            { id: 'decisions', label: 'Decisions' },
            { id: 'commitments', label: 'Commitments' },
            { id: 'action_items', label: 'Action items' },
            { id: 'preferences', label: 'Important preferences' },
            { id: 'unresolved_issues', label: 'Unresolved issues' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MemoryTabFilter)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Tab Contents */}
        {activeTab === 'meetings' ? (
          <div className="space-y-3">
            {previousMeetings.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                    <span className="text-xs text-slate-500">{m.date} · {m.startTime}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{m.purpose}</p>
                  <div className="mt-2 text-[11px] text-slate-500">
                    With: <span className="font-semibold">{m.contactName} ({m.company})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'unresolved_issues' ? (
          <div className="space-y-3">
            {allUnresolvedIssues.length > 0 ? (
              allUnresolvedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/60 rounded-xl p-5 shadow-card flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{issue.title}</h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {issue.severity} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{issue.description}</p>
                    <div className="mt-2 text-[11px] text-slate-500">
                      Identified with: <span className="font-semibold">{issue.contactName} ({issue.company})</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                No active unresolved issues logged.
              </div>
            )}
          </div>
        ) : activeTab === 'action_items' || activeTab === 'commitments' ? (
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.description}</span>
                    {item.dueDate && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Due: {item.dueDate}</span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Stakeholder: <span className="font-semibold">{item.contactName}</span> · {item.type === 'you_owe_them' ? 'You promised' : 'They owe you'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {mem.category === 'decision' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {mem.category === 'preference' && <Sliders className="w-4 h-4 text-indigo-500" />}
                    {mem.category === 'personal' && <Heart className="w-4 h-4 text-rose-500" />}
                    {mem.category === 'strategic' && <Briefcase className="w-4 h-4 text-amber-500" />}
                    {mem.category === 'commitment' && <Target className="w-4 h-4 text-sky-500" />}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                        {mem.category}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {mem.contactName} ({mem.contactCompany})
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800">
                        {Math.round(mem.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {mem.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span>Added {mem.dateAdded}</span>
                      {mem.sourceMeetingTitle && (
                        <>
                          <span>·</span>
                          <span className="truncate">Source: {mem.sourceMeetingTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePinMemory(mem.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      mem.pinned
                        ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title={mem.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredMemories.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                No memories found matching your criteria.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

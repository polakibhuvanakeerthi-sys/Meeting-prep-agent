import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  CheckSquare, 
  BookmarkCheck,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MemoryChangeItem } from '../../types';
import { Badge } from '../common/Badge';

interface MemoryChangesSectionProps {
  changes: MemoryChangeItem[];
  meetingTitle?: string;
  contactName?: string;
  onViewContact?: () => void;
  onOpenPrep?: () => void;
  showNavigationButtons?: boolean;
}

export const MemoryChangesSection: React.FC<MemoryChangesSectionProps> = ({
  changes,
  meetingTitle = 'Product Strategy Discussion',
  contactName = 'Rahul Sharma',
  onViewContact,
  onOpenPrep,
  showNavigationButtons = true
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!changes || changes.length === 0) return null;

  const handleCopySummary = () => {
    const formatted = changes
      .map((c) => `${c.label}\n${c.title}${c.detail ? ` (${c.detail})` : ''}`)
      .join('\n\n');
    navigator.clipboard.writeText(`MeetMind AI — Memory Evolution Log\nMeeting: ${meetingTitle}\nContact: ${contactName}\n\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const newItems = changes.filter((c) => c.type === 'new');
  const resolvedItems = changes.filter((c) => c.type === 'resolved');
  const updatedItems = changes.filter((c) => c.type === 'updated');

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-card animate-slide-up">
      {/* Header bar */}
      <div className="bg-linear-to-r from-indigo-50/80 via-white to-emerald-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/30 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Memory Changes
              </h3>
              <Badge variant="indigo" size="sm">
                Evolving Relationship Memory
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              MeetMind detected and merged {changes.length} persistent memory state updates from this interaction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            title="Copy memory diff"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Changes</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Diff Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Quick Stats Pill Ribbon */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              {resolvedItems.length} Resolved
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/80 dark:border-amber-800">
              <RefreshCw className="w-3.5 h-3.5" />
              {updatedItems.length} Updated
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800">
              <Plus className="w-3.5 h-3.5" />
              {newItems.length} New Facts
            </span>
          </div>

          {/* User Requested Format Cards:
              + New commitment:
              Deliver Feature X before October 15

              ✓ Resolved:
              Pricing concern

              ↻ Updated:
              Implementation timeline
          */}
          <div className="space-y-3">
            {changes.map((item) => {
              const isResolved = item.type === 'resolved';
              const isUpdated = item.type === 'updated';
              const isNew = item.type === 'new';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isResolved
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80'
                      : isUpdated
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80'
                      : 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* Label with requested styling (e.g. "+ New commitment:", "✓ Resolved:", "↻ Updated:") */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            isResolved
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : isUpdated
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-indigo-700 dark:text-indigo-400'
                          }`}
                        >
                          {isResolved && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {isUpdated && <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {isNew && <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                          <span>{item.label.replace(/^[+✓↻]\s*/, '')}</span>
                        </span>

                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm bg-white/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>

                      {/* Main Title / Description */}
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </p>

                      {/* Detail note if available */}
                      {item.detail && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                          {item.detail}
                        </p>
                      )}
                    </div>

                    {/* Category Icon Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : isUpdated
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                      }`}
                    >
                      {item.category === 'commitment' && <Clock className="w-4 h-4" />}
                      {item.category === 'concern' && <ShieldCheck className="w-4 h-4" />}
                      {item.category === 'requirement' && <CheckSquare className="w-4 h-4" />}
                      {item.category === 'decision' && <BookmarkCheck className="w-4 h-4" />}
                      {item.category === 'date' && <Calendar className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTAs to navigate to updated profile or meeting prep */}
          {showNavigationButtons && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Persistent graph updated for <strong className="text-slate-700 dark:text-slate-300">{contactName}</strong>. Ready for future meeting preparation.
              </span>

              <div className="flex items-center gap-2">
                {onViewContact && (
                  <button
                    onClick={onViewContact}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Updated Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onOpenPrep && (
                  <button
                    onClick={onOpenPrep}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Prepare Next Meeting</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

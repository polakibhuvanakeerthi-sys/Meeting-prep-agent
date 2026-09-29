import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CommitmentsPreview: React.FC = () => {
  const { commitments, toggleCommitment, navigateToContact, contacts, setCurrentView } = useApp();

  const pendingCommitments = commitments.filter((c) => c.status === 'pending').slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Open Commitments & Action Items
            </h2>
            <span className="text-xs bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
              {commitments.filter((c) => c.status === 'pending').length} Open
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Never drop a promise made in previous discussions.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('contacts')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
        >
          <span>View all contacts</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {pendingCommitments.map((com) => {
          const isYouOwe = com.type === 'you_owe_them';
          const contact = contacts.find((c) => c.id === com.contactId);

          return (
            <div
              key={com.id}
              className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5 group"
            >
              <button
                onClick={() => toggleCommitment(com.id)}
                className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                title="Mark as completed"
              >
                {com.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={isYouOwe ? 'warning' : 'slate'} size="sm">
                    {isYouOwe ? 'You Owe Them' : 'They Owe You'}
                  </Badge>
                  {com.dueDate && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      Due: {com.dueDate}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {com.description}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>With:</span>
                  <button
                    onClick={() => contact && navigateToContact(contact.id)}
                    className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                  >
                    {com.contactName}
                  </button>
                  {com.meetingTitle && (
                    <>
                      <span>·</span>
                      <span className="truncate text-slate-400 max-w-xs">{com.meetingTitle}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

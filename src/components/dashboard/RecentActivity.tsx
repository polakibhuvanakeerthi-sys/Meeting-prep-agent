import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  Calendar, 
  FileText, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecentActivity: React.FC = () => {
  const { activity, setCurrentView, navigateToContact, contacts } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'memory_saved':
        return <BrainCircuit className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'commitment_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'meeting_prepared':
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'meeting_logged':
        return <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeVariant = (type: string): 'default' | 'primary' | 'success' | 'warning' | 'purple' => {
    switch (type) {
      case 'memory_saved':
        return 'purple';
      case 'commitment_completed':
        return 'success';
      case 'meeting_prepared':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Recent Activity & Memory Updates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated intelligence logging from your calendars, notes, and commitments.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('memory')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
        >
          <span>View all in Memory Bank</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {activity.map((item) => {
          const matchingContact = contacts.find((c) => c.name === item.contactName);
          
          return (
            <div
              key={item.id}
              className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-4"
            >
              {/* Icon avatar */}
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    {item.badgeText && (
                      <Badge variant={getBadgeVariant(item.type)} size="sm">
                        {item.badgeText}
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Related to:</span>
                  <button
                    onClick={() => matchingContact && navigateToContact(matchingContact.id)}
                    className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 cursor-pointer"
                  >
                    {item.contactName} ({item.contactCompany})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarCheck, 
  CalendarDays, 
  CheckSquare, 
  Users, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { meetings, commitments, contacts, setCurrentView } = useApp();

  const todayMeetings = meetings.filter((m) => m.isToday);
  const upcomingMeetings = meetings.filter((m) => !m.isToday);
  const openCommitments = commitments.filter((c) => c.status === 'pending');

  const cards = [
    {
      title: "Today's Meetings",
      count: todayMeetings.length,
      subtitle: `${todayMeetings.filter((m) => m.prepStatus === 'ready').length} briefings ready`,
      icon: CalendarCheck,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40',
      onClick: () => setCurrentView('meetings'),
      badge: 'Active Today',
      badgeColor: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/80 dark:text-indigo-300'
    },
    {
      title: 'Upcoming Meetings',
      count: upcomingMeetings.length,
      subtitle: 'Next 7 days across 4 partners',
      icon: CalendarDays,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40',
      onClick: () => setCurrentView('meetings'),
      badge: 'Calendar Synced',
      badgeColor: 'text-sky-700 bg-sky-50 dark:bg-sky-950/80 dark:text-sky-300'
    },
    {
      title: 'Open Commitments',
      count: openCommitments.length,
      subtitle: `${commitments.filter(c => c.type === 'you_owe_them' && c.status === 'pending').length} you owe, ${commitments.filter(c => c.type === 'they_owe_you' && c.status === 'pending').length} waiting on`,
      icon: CheckSquare,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40',
      onClick: () => setCurrentView('contact-details'),
      badge: 'Action Items',
      badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/80 dark:text-amber-300'
    },
    {
      title: 'Contacts in Graph',
      count: contacts.length,
      subtitle: 'Average relationship warmth 84%',
      icon: Users,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40',
      onClick: () => setCurrentView('contacts'),
      badge: 'Live Dossiers',
      badgeColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.onClick}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-card hover:shadow-elevated hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  {card.count}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

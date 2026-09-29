import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Sparkles, 
  Video, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const TodayMeetings: React.FC = () => {
  const { meetings, contacts, navigateToMeetingPrep, navigateToContact } = useApp();

  const todayMeetings = meetings.filter((m) => m.isToday);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Today's Meetings
            </h2>
            <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/50">
              {todayMeetings.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time relationship briefings synthesized from past interactions & open commitments.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Google Calendar & Meet Connected</span>
        </div>
      </div>

      {/* Meeting Cards List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {todayMeetings.map((meeting) => {
          const contact = contacts.find((c) => c.id === meeting.contactId);
          
          return (
            <div
              key={meeting.id}
              className="p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 group"
            >
              {/* Left Column: Time & Contact Info */}
              <div className="flex items-start gap-4">
                {/* Time block */}
                <div className="shrink-0 w-24 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 text-center">
                  <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{meeting.startTime}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    {meeting.endTime}
                  </span>
                </div>

                {/* Contact & Meeting Main Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {meeting.title}
                    </h3>
                    <Badge variant="primary" size="sm">
                      {meeting.meetingType}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => contact && navigateToContact(contact.id)}
                      className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium group/contact text-left cursor-pointer"
                    >
                      {contact && (
                        <img
                          src={contact.avatarUrl}
                          alt={meeting.contactName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{meeting.contactName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 dark:text-slate-400 font-normal">
                        {meeting.company}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>

                  {/* Short Purpose */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Purpose: </span>
                    {meeting.purpose}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-3 lg:shrink-0 pt-2 lg:pt-0 self-end lg:self-center">
                {contact && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToContact(contact.id)}
                    className="text-xs"
                  >
                    View Dossier
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="md"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={() => navigateToMeetingPrep(meeting.id)}
                  className="shadow-sm"
                >
                  Prepare Me
                </Button>
              </div>
            </div>
          );
        })}

        {todayMeetings.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No more meetings scheduled for today!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              You’re all caught up. Check out upcoming meetings or review open commitments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

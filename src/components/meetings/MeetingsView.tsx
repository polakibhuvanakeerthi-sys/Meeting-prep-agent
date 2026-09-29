import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  Sparkles, 
  Video, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Link2
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const MeetingsView: React.FC = () => {
  const { 
    meetings, 
    contacts, 
    navigateToMeetingPrep, 
    navigateToContact, 
    setIsAddMeetingOpen,
    workspaceIntegrations,
    connectGoogle,
    connectMicrosoft,
    setCurrentView 
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'upcoming' | 'sample' | 'user'>('all');
  const [search, setSearch] = useState('');

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.contactName.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.purpose.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'today') return m.isToday;
    if (filterTab === 'upcoming') return !m.isToday;
    if (filterTab === 'sample') return m.dataSource === 'sample';
    if (filterTab === 'user') return m.dataSource === 'user';
    return true;
  });

  const getSourceBadge = (source?: string) => {
    if (source === 'sample') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Sample Data
        </span>
      );
    }
    if (source === 'connected') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live Synced
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        User Created
      </span>
    );
  };

  const isAnyCalendarConnected = workspaceIntegrations.google || workspaceIntegrations.microsoft;

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Meetings
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              {meetings.length} Scheduled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your upcoming conversations and prepare executive dossiers with AI.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddMeetingOpen(true)}
          >
            Add Meeting
          </Button>
        </div>
      </div>

      {/* Calendar Connection Banner adhering to Requirement 2 */}
      {!isAnyCalendarConnected && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              No calendar connected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect your calendar to see your real meetings. (Currently viewing Demo Workspace)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={connectGoogle}
              icon={<span className="font-bold text-blue-600 text-xs">G</span>}
            >
              Connect Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={connectMicrosoft}
              icon={<span className="font-bold text-sky-600 text-xs">M</span>}
            >
              Connect Microsoft
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search meetings, contacts, or agenda items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterTab('all')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({meetings.length})
          </button>
          <button
            onClick={() => setFilterTab('today')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'today'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Today ({meetings.filter((m) => m.isToday).length})
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterTab === 'upcoming'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Upcoming ({meetings.filter((m) => !m.isToday).length})
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => {
            const contact = contacts.find((c) => c.id === meeting.contactId);

            return (
              <div
                key={meeting.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Meeting Details */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        meeting.isToday
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {meeting.date}
                    </span>
                    <Badge variant="primary" size="sm">
                      {meeting.meetingType}
                    </Badge>
                    {getSourceBadge(meeting.dataSource)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {meeting.startTime} – {meeting.endTime}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      {meeting.location}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {meeting.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {meeting.contactName}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {meeting.company}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                    {meeting.purpose}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Briefing Ready
                    </span>
                  </div>
                </div>

                {/* Actions: Primary CTA [ Prepare Me ] */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
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
                    className="font-semibold px-5 shadow-xs"
                  >
                    Prepare Me
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-card">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              No meetings found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No meetings matched your search criteria. Add a new meeting or reset your filters.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddMeetingOpen(true)}
              >
                Add Meeting
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

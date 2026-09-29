import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Building2, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  Circle,
  Plus,
  BrainCircuit,
  Sliders,
  Heart,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AIMemoryOrb } from '../common/AIMemoryOrb';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    meetings, 
    contacts, 
    commitments, 
    memories,
    toggleCommitment,
    navigateToMeetingPrep, 
    navigateToContact, 
    setCurrentView,
    setIsAddMeetingOpen 
  } = useApp();

  // Find next upcoming meeting (prefer today's meeting)
  const todayMeetings = meetings.filter((m) => m.isToday);
  const nextMeeting = todayMeetings[0] || meetings.find((m) => !m.isToday) || meetings[0];
  const nextMeetingContact = nextMeeting ? contacts.find((c) => c.id === nextMeeting.contactId) : null;

  // Open action items (pending commitments)
  const openActionItems = commitments.filter((c) => c.status === 'pending').slice(0, 4);

  // Recent memories (latest 3)
  const recentMemories = memories.slice(0, 3);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getSourceBadge = (source?: string) => {
    if (source === 'sample') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Sample Agenda
        </span>
      );
    }
    if (source === 'connected') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Calendar Synced
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        User Created
      </span>
    );
  };

  const getMemoryCategoryIcon = (category: string) => {
    switch (category) {
      case 'decision':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'preference':
        return <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'personal':
        return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      case 'strategic':
        return <Briefcase className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <BrainCircuit className="w-3.5 h-3.5 text-violet-500" />;
    }
  };

  return (
    <div className="space-y-10 animate-rise-slow pb-20 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. PRIMARY SECTION: Greeting & Next Meeting Hero */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Top Greeting with 3D Memory Orb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome to MeetMind AI
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="MeetMind Agent Active" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl">
              MeetMind remembers your conversations, decisions, commitments and context so you walk into every meeting prepared.
            </p>
          </div>

          {/* 3D AI Memory Orb Element */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="relative">
              <AIMemoryOrb size={100} particleCount={40} />
            </div>
            <div className="text-left hidden lg:block">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  AI Memory Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Continuously synthesizing context
              </p>
            </div>
          </div>
        </div>

        {/* Your Next Meeting Card */}
        {nextMeeting ? (
          <div className="card-depth-subtle relative overflow-hidden bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Your next meeting
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    {nextMeeting.date}
                  </span>
                  {getSourceBadge(nextMeeting.dataSource)}
                </div>

                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {nextMeeting.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {nextMeeting.contactName}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">/</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {nextMeeting.company}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-3.5 h-3.5" />
                      {nextMeeting.startTime} – {nextMeeting.endTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                  {nextMeeting.purpose}
                </p>
              </div>

              {/* Primary CTA */}
              <div className="shrink-0 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={() => navigateToMeetingPrep(nextMeeting.id)}
                  className="shadow-sm font-semibold px-6 py-3 cursor-pointer"
                >
                  Prepare Me
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-card">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              No upcoming meetings
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Connect your calendar to sync your schedule or schedule a meeting manually.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddMeetingOpen(true)}
              >
                Add Meeting
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('settings')}
              >
                Connect Calendar
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. TODAY'S MEETINGS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Today's Meetings
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {todayMeetings.length}
            </span>
          </div>

          <button
            onClick={() => setCurrentView('meetings')}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
          >
            <span>All meetings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {todayMeetings.length > 0 ? (
            todayMeetings.map((meeting) => {
              const contact = contacts.find((c) => c.id === meeting.contactId);
              return (
                <div
                  key={meeting.id}
                  className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Time badge */}
                    <div className="shrink-0 w-20 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 text-center">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                        {meeting.startTime}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {meeting.endTime}
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {meeting.title}
                        </h3>
                        <Badge variant="primary" size="sm">
                          {meeting.meetingType}
                        </Badge>
                        {getSourceBadge(meeting.dataSource)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {meeting.contactName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span>{meeting.company}</span>
                        <span className="text-slate-400">·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Video className="w-3 h-3 text-slate-400" />
                          {meeting.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
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
                      size="sm"
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                      onClick={() => navigateToMeetingPrep(meeting.id)}
                    >
                      Prepare Me
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No meetings scheduled for today. Check upcoming meetings or add a new schedule.
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OPEN ACTION ITEMS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Open Action Items
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
              {openActionItems.length} Pending
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {openActionItems.length > 0 ? (
            openActionItems.map((item) => {
              const isYouOwe = item.type === 'you_owe_them';
              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5 group"
                >
                  <button
                    onClick={() => toggleCommitment(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                    title="Mark complete"
                  >
                    <Circle className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isYouOwe 
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isYouOwe ? 'You promised' : 'Awaiting delivery'}
                      </span>
                      {item.dueDate && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          Due: {item.dueDate}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Contact:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.contactName}
                      </span>
                      {item.meetingTitle && (
                        <>
                          <span>·</span>
                          <span className="truncate text-slate-400 max-w-xs">{item.meetingTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No open action items. You are completely caught up!
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECENT MEMORY */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Recent Memory
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
              {recentMemories.length} Captured
            </span>
          </div>

          <button
            onClick={() => setCurrentView('memory')}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
          >
            <span>View Memory Bank</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {recentMemories.length > 0 ? (
            recentMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getMemoryCategoryIcon(mem.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                        {mem.category}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {mem.contactName} ({mem.contactCompany})
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500">
                      {mem.dateAdded}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {mem.content}
                  </p>

                  {mem.tags && mem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {mem.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No memories recorded yet. MeetMind AI captures decisions, commitments, and preferences as you meet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

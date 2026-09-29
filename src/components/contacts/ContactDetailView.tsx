import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Flame, 
  Building2, 
  Mail, 
  MapPin, 
  Plus, 
  BrainCircuit, 
  FileText, 
  MessageSquare, 
  Send, 
  Target, 
  ShieldAlert, 
  Layers, 
  History, 
  CheckSquare, 
  Tag,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Sliders,
  Laptop,
  BookmarkCheck,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TimelineItem } from '../../types';
import { ensureStructuredMemory } from '../../utils/memoryEngine';
import { MemoryChangesSection } from '../memory/MemoryChangesSection';

export const ContactDetailView: React.FC = () => {
  const { 
    selectedContactId, 
    setSelectedContactId,
    contacts, 
    commitments, 
    meetings,
    setCurrentView, 
    navigateToMeetingPrep,
    toggleCommitment,
    addCommitment,
    setIsAddMemoryOpen,
    showToast,
    memoryChangeLogs
  } = useApp();

  const [newCommitmentText, setNewCommitmentText] = useState('');
  const [newCommitmentType, setNewCommitmentType] = useState<'you_owe_them' | 'they_owe_you'>('you_owe_them');
  const [isAddingCommitment, setIsAddingCommitment] = useState(false);
  const [prioritiesTab, setPrioritiesTab] = useState<'current' | 'historical'>('current');
  const [concernsTab, setConcernsTab] = useState<'all' | 'active' | 'resolved'>('all');

  // Find the selected contact
  const contact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  if (!contact) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-card">
        <button
          onClick={() => setCurrentView('contacts')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Contacts</span>
        </button>
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          No contact selected
        </h2>
        <p className="text-xs text-slate-500">
          Connect your workspace or select a contact to view their relationship memory dossier.
        </p>
      </div>
    );
  }

  const structured = contact.relationshipMemory || ensureStructuredMemory(contact);
  const contactChangeLogs = memoryChangeLogs.filter((log) => log.contactId === contact.id);

  // Filter commitments for this contact
  const contactCommitments = commitments.filter((c) => c.contactId === contact.id);
  const pendingCommitments = contactCommitments.filter((c) => c.status === 'pending');

  // Find any associated meeting for this contact to prepare for
  const nextMeeting = meetings.find((m) => m.contactId === contact.id && m.isToday) || 
    meetings.find((m) => m.contactId === contact.id) || 
    meetings[0];

  const handleAddCommitmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitmentText.trim()) return;
    addCommitment(contact.id, newCommitmentText, newCommitmentType, 'Next Interaction');
    setNewCommitmentText('');
    setIsAddingCommitment(false);
  };

  const getTimelineIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'note':
        return <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'decision':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'followup':
        return <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTimelineBadge = (type: TimelineItem['type']) => {
    switch (type) {
      case 'meeting':
        return <Badge variant="primary" size="sm">Meeting</Badge>;
      case 'email':
        return <Badge variant="slate" size="sm">Email</Badge>;
      case 'note':
        return <Badge variant="warning" size="sm">Internal Note</Badge>;
      case 'decision':
        return <Badge variant="success" size="sm">Decision</Badge>;
      default:
        return <Badge variant="default" size="sm">Touchpoint</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Breadcrumb & Prominent Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('contacts')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Contacts</span>
        </button>

        {/* PROMINENT "Prepare Me for Next Meeting" BUTTON */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />}
            onClick={() => {
              setSelectedContactId(contact.id);
              setCurrentView('update-memory');
            }}
          >
            Update Memory
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => {
              if (nextMeeting) {
                navigateToMeetingPrep(nextMeeting.id);
              } else {
                showToast('Meeting Briefing', 'Generating briefing based on persistent memory...', 'info');
                navigateToMeetingPrep(meetings[0].id);
              }
            }}
            className="shadow-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5"
          >
            Prepare Me for Next Meeting
          </Button>
        </div>
      </div>


      {/* Contact Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              className="w-18 h-18 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {contact.name}
                </h1>
                <Badge variant="primary" size="sm">
                  {contact.relationshipStatus}
                </Badge>
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {contact.role} · <span className="text-indigo-600 dark:text-indigo-400 font-bold">{contact.company}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {contact.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {contact.location} ({contact.timezone})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Last Interaction: <strong className="text-slate-700 dark:text-slate-300 font-medium ml-1">{contact.lastInteraction}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Warmth & Health Gauge */}
          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800 gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-2 rounded-xl">
              <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {contact.warmthScore}% Warmth Score
                </span>
                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block font-medium">
                  High Engagement Intent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LATEST MEMORY EVOLUTION (If changes logged from recent meeting debrief) */}
      {contactChangeLogs.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          <MemoryChangesSection
            changes={contactChangeLogs[0].changes}
            meetingTitle={contactChangeLogs[0].meetingTitle}
            contactName={contact.name}
            showNavigationButtons={false}
          />
        </div>
      )}

      {/* SECTION 1: Relationship Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            1. Relationship Overview
          </h2>
          <span className="text-xs text-slate-400">
            High-level metrics across all channels
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          {/* Current Status */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Current Status
            </span>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {contact.relationshipStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Active deal evaluation phase
            </p>
          </div>

          {/* Last Interaction */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Last Interaction
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold">
                {contact.lastInteraction}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pricing concern raised
            </p>
          </div>

          {/* Total Interactions */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Interactions
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 text-slate-900 dark:text-white">
              <span className="text-2xl font-display font-extrabold">
                {contact.totalInteractions || 11}
              </span>
              <span className="text-xs text-slate-500">
                touchpoints
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {contact.totalMeetings} meetings · 5 emails · 2 notes
            </p>
          </div>

          {/* Open Commitments */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              Open Commitments
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5 text-amber-900 dark:text-amber-200">
              <span className="text-2xl font-display font-extrabold">
                {pendingCommitments.length}
              </span>
              <span className="text-xs font-semibold">
                deliverables pending
              </span>
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
              Requires follow-up before next call
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 7: AI Memory Summary ("MeetMind remembers") */}
      {/* Placed prominently right near top to show persistent relationship memory accumulated across interactions */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-6 shadow-card space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                MeetMind remembers
              </h2>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                Autonomous relationship memory synthesis
              </p>
            </div>
          </div>

          {/* CRITICAL: UI makes it obvious that information was accumulated across multiple interactions */}
          <div className="flex items-center gap-2 bg-indigo-100/70 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-800 dark:text-indigo-200">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {contact.meetMindRemembers?.synthesisMeta?.timespan || 'Accumulated across 4 meetings & 7 async touchpoints (32 days)'}
            </span>
          </div>
        </div>

        {/* AI Summary Text */}
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
          {contact.meetMindRemembers?.summary || (
            `${contact.name} is enthusiastic about our platform capabilities and wants to champion the rollout at ${contact.company}. However, he is caught between engineering’s firm timeline (live before Oct 15 with Feature X) and procurement’s pricing sensitivity. Closing this deal hinges on delivering the revised proposal with modular pricing and confirming the Feature X delivery schedule.`
          )}
        </p>

        {/* Synthesized Key Insights */}
        {contact.meetMindRemembers?.keyInsights && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              Key Relationship Insights Remembered:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {contact.meetMindRemembers.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-indigo-100/80 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 leading-snug flex items-start gap-2"
                >
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Metadata Ribbon */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-indigo-100/60 dark:border-indigo-900/40">
          <div className="flex items-center gap-3">
            <span>Model: MeetMind Context Engine v2.4</span>
            <span>·</span>
            <span>Confidence: 96%</span>
            <span>·</span>
            <span>Source touchpoints: 4 meetings, 5 emails, 2 notes</span>
          </div>

          <button
            onClick={() => nextMeeting && navigateToMeetingPrep(nextMeeting.id)}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch pre-meeting briefing</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Section 2 (Priorities) & Section 3 (Concerns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 2: Priorities (Current & Historical) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              2. Priorities
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setPrioritiesTab('current')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  prioritiesTab === 'current'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Current ({structured.priorities.current.length})
              </button>
              <button
                onClick={() => setPrioritiesTab('historical')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  prioritiesTab === 'historical'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Historical ({structured.priorities.historical.length})
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {prioritiesTab === 'current' 
              ? `What ${contact.name} cares about most right now.`
              : `Past milestones achieved or superseded across earlier discussions.`}
          </p>

          <div className="space-y-2.5 pt-1">
            {prioritiesTab === 'current' ? (
              structured.priorities.current.map((priority, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {priority}
                  </span>
                </div>
              ))
            ) : (
              structured.priorities.historical.map((hp) => (
                <div
                  key={hp.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {hp.priority}
                    </span>
                    {hp.achievedDate && (
                      <span className="text-[10px] text-slate-400 font-medium">{hp.achievedDate}</span>
                    )}
                  </div>
                  {hp.outcome && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                      Outcome: {hp.outcome}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 3: Concerns (Active & Resolved) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              3. Concerns
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setConcernsTab('all')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  concernsTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setConcernsTab('active')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  concernsTab === 'active'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Active ({structured.concerns.active.length})
              </button>
              <button
                onClick={() => setConcernsTab('resolved')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  concernsTab === 'resolved'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Resolved ({structured.concerns.resolved.length})
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Frictions and objections voiced during previous discussions.
          </p>

          <div className="space-y-3 pt-1">
            {/* Active Concerns */}
            {(concernsTab === 'all' || concernsTab === 'active') &&
              structured.concerns.active.map((concern) => (
                <div
                  key={concern.id}
                  className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      {concern.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                      {concern.severity} sensitivity · Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {concern.description}
                  </p>
                </div>
              ))}

            {/* Resolved Concerns */}
            {(concernsTab === 'all' || concernsTab === 'resolved') &&
              structured.concerns.resolved.map((concern) => (
                <div
                  key={concern.id}
                  className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {concern.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      ✓ Resolved {concern.resolvedDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {concern.resolutionNotes}
                  </p>
                </div>
              ))}

            {concernsTab === 'active' && structured.concerns.active.length === 0 && (
              <div className="p-6 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60">
                ✓ No active concerns! All previous issues have been resolved.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: Open Commitments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-500" />
              4. Commitments
            </h2>
            <span className="text-xs bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
              {pendingCommitments.length} Pending
            </span>
          </div>

          {!isAddingCommitment && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddingCommitment(true)}
            >
              Add Commitment
            </Button>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Persistent action items and promises made between you and {contact.name}. Check an item off to mark it completed.
        </p>

        {/* Inline Add Commitment Form */}
        {isAddingCommitment && (
          <form
            onSubmit={handleAddCommitmentSubmit}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Log Commitment for {contact.name}
            </h4>
            <input
              type="text"
              placeholder="What was promised? (e.g. Share implementation timeline)"
              value={newCommitmentText}
              onChange={(e) => setNewCommitmentText(e.target.value)}
              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Obligation:
                </label>
                <select
                  value={newCommitmentType}
                  onChange={(e) => setNewCommitmentType(e.target.value as any)}
                  className="text-xs p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="you_owe_them">You owe {contact.name}</option>
                  <option value="they_owe_you">{contact.name} owes you</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingCommitment(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Commitment
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Commitments List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden">
          {contactCommitments.map((com) => {
            const isYouOwe = com.type === 'you_owe_them';

            return (
              <div
                key={com.id}
                className="p-4 flex items-start gap-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <button
                  onClick={() => toggleCommitment(com.id)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                  title={com.status === 'completed' ? 'Re-open commitment' : 'Mark completed'}
                >
                  {com.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={isYouOwe ? 'warning' : 'slate'} size="sm">
                      {isYouOwe ? 'You Owe Them' : `${contact.name} Owes You`}
                    </Badge>
                    {com.dueDate && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        Due: {com.dueDate}
                      </span>
                    )}
                    {com.status === 'completed' && (
                      <Badge variant="success" size="sm">
                        Fulfilled
                      </Badge>
                    )}
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      com.status === 'completed'
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100 font-semibold'
                    }`}
                  >
                    {com.description}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Logged from {com.meetingTitle || 'Recent Discussion'}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {contactCommitments.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No open commitments recorded for {contact.name}.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Requirements */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-500" />
            5. Requirements
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Explicit technical & timeline gates
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Non-negotiable conditions required by {contact.name} and {contact.company} before rollout.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {structured.requirements.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                req.status === 'satisfied'
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                  : req.status === 'updated'
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {req.requirement}
                  </span>
                  {req.status === 'updated' && (
                    <Badge variant="warning" size="sm">
                      ↻ Updated
                    </Badge>
                  )}
                  {req.status === 'satisfied' && (
                    <Badge variant="success" size="sm">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Source: <strong>{req.sourceInteraction}</strong>
                </p>
                {req.previousVersion && (
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    Previous: {req.previousVersion}
                  </p>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  req.status === 'satisfied'
                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300'
                    : req.status === 'updated'
                    ? 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {req.status === 'satisfied' ? 'Satisfied' : req.status === 'updated' ? 'Refined' : 'Active Gate'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Decisions & Important Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 6: Decisions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-indigo-500" />
              6. Decisions
            </h2>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/50">
              {structured.decisions.length} Confirmed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Binding agreements and formal conclusions reached across meetings.
          </p>

          <div className="space-y-2.5 pt-1">
            {structured.decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {dec.decision}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {dec.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Related Meeting: {dec.relatedMeeting}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Important Dates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              7. Important Dates
            </h2>
            <span className="text-xs bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/50">
              {structured.importantDates.length} Dates
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hard deadlines, internal freezes, and personal milestones to remember.
          </p>

          <div className="space-y-2.5 pt-1">
            {structured.importantDates.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {item.date}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
                {item.category && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shrink-0">
                    {item.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: Interaction Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              8. Interaction Timeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological log of meetings, emails, notes, decisions, and follow-ups.
            </p>
          </div>

          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg">
            {contact.interactionTimeline?.length || 4} Touchpoints
          </span>
        </div>

        {/* Timeline Visual Feed */}
        <div className="relative pl-6 sm:pl-8 space-y-6 pt-3 before:absolute before:left-2.5 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {(contact.interactionTimeline || [
            {
              id: 'tl-1',
              date: 'Sep 25',
              type: 'meeting',
              title: 'Pricing concern discussed',
              summary: 'Met with Rahul and ABC Tech finance team. Rahul explicitly noted current tier pricing exceeds their Q4 pilot envelope. Promised to send revised proposal by Tuesday.',
              highlight: 'Requested 15% starter discount for 30 seats',
              sourceContext: 'Virtual Call via Google Meet (42 mins)'
            },
            {
              id: 'tl-2',
              date: 'Sep 18',
              type: 'email',
              title: 'Feature X requested',
              summary: 'Rahul emailed technical requirements documentation specifying Feature X (bidirectional webhook sync with audit trail) as an absolute prerequisite for sign-off.',
              highlight: 'Feature X is non-negotiable for their InfoSec team',
              sourceContext: 'Email thread: Re: Platform Integration Architecture'
            },
            {
              id: 'tl-3',
              date: 'Sep 10',
              type: 'meeting',
              title: 'Implementation timeline discussed',
              summary: 'Reviewed migration sequence with Rahul and engineering staff. Clarified their internal freeze starts November 1, necessitating go-live by October 15.',
              highlight: 'Target go-live set for Oct 15',
              sourceContext: 'Virtual Call via Zoom (35 mins)'
            },
            {
              id: 'tl-4',
              date: 'Aug 28',
              type: 'meeting',
              title: 'Initial proposal presented',
              summary: 'First discovery and demo session. Demonstrated relationship memory capabilities and workflow sync. Rahul expressed strong product enthusiasm.',
              highlight: 'Evaluated as top vendor among 3 candidates',
              sourceContext: 'Kickoff Call (50 mins)'
            }
          ]).map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-xs">
                {getTimelineIcon(item.type)}
              </div>

              {/* Content Card */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.date}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    {getTimelineBadge(item.type)}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>

                  {item.sourceContext && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.sourceContext}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.summary}
                </p>

                {item.highlight && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Memory Highlight: {item.highlight}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

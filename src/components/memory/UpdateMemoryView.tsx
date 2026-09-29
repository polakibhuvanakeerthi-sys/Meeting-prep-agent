import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  Tag, 
  FileText, 
  Send, 
  TrendingUp, 
  Check, 
  Building2,
  BookmarkCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ExtractedMemoryData, Contact } from '../../types';
import { MemoryChangesSection } from './MemoryChangesSection';
import { extractMemoryAI } from '../../services/aiLayer';

export const UpdateMemoryView: React.FC = () => {
  const { 
    selectedContactId, 
    contacts, 
    meetings, 
    selectedMeetingId, 
    setCurrentView, 
    navigateToContact,
    navigateToMeetingPrep,
    applyMeetingMemoryUpdate,
    latestMemoryChanges
  } = useApp();

  const resolvedContact: Contact = contacts.find((c) => c.id === selectedContactId) || contacts[0] || {
    id: 'contact-fallback',
    name: 'Partner Executive',
    role: 'Commercial Lead',
    company: 'Partner Enterprise',
    email: 'contact@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Remote',
    timezone: 'UTC',
    warmthScore: 85,
    relationshipStatus: 'In Evaluation',
    lastInteraction: 'Sep 25, 2026',
    lastMeetingDate: 'Sep 25, 2026',
    totalMeetings: 4,
    totalInteractions: 8,
    openCommitmentsCount: 2,
    tags: ['Enterprise Deal'],
    bio: '',
    communicationStyle: '',
    decisionMakingStyle: '',
    keyProjects: [],
    keyPriorities: [],
    knownConcerns: [],
    importantRequirements: [],
    interactionTimeline: [],
    meetMindRemembers: {
      summary: 'Executive partner evaluating commercial rollout.',
      keyInsights: [],
      synthesisMeta: {
        meetingsCount: 4,
        emailsCount: 5,
        notesCount: 2,
        timespan: 'Last 30 days',
        confidenceScore: 0.95,
        lastInteraction: 'Today'
      }
    }
  };

  const contact = resolvedContact;
  const meeting = meetings.find((m) => m.id === selectedMeetingId && m.contactId === contact.id) || 
    meetings.find((m) => m.contactId === contact.id) || 
    meetings[0];

  const defaultSampleNotes = `Stakeholder accepted the revised modular pricing proposal.
Feature X integration is required before October 15.
Agreed on 99.9% uptime SLA schedule and confirmed procurement review this week.`;

  const [notes, setNotes] = useState(defaultSampleNotes);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedMemoryData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Handle AI Memory Extraction (Operation 2: EXTRACT MEMORY)
  const handleExtractMemory = async () => {
    if (!notes.trim()) return;
    setIsExtracting(true);
    setIsSaved(false);

    try {
      // Call AI Layer Operation 2
      const result = await extractMemoryAI({
        notesOrTranscript: notes,
        contactProfile: contact,
        currentMeeting: meeting
      });

      setExtractedData({
        decisions: result.decisions,
        newRequirements: result.new_requirements,
        commitments: result.new_commitments,
        resolvedIssues: result.resolved_issues,
        newConcerns: result.new_concerns,
        importantDates: result.important_dates,
        summary: result.summary,
        // Exact snake_case mappings
        new_requirements: result.new_requirements,
        new_commitments: result.new_commitments,
        resolved_issues: result.resolved_issues,
        new_concerns: result.new_concerns,
        important_dates: result.important_dates
      });
    } catch (err) {
      console.error('Error during AI memory extraction:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  // Save to Relationship Memory
  const handleSaveMemory = () => {
    if (!extractedData) return;

    applyMeetingMemoryUpdate(
      contact.id,
      meeting?.title || 'Product Strategy Discussion',
      extractedData,
      notes
    );

    setIsSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (meeting) {
              navigateToMeetingPrep(meeting.id);
            } else {
              navigateToContact(contact.id);
            }
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Meeting Preparation</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>MeetMind Continuous Memory Loop</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Header (Exact user requirements) */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Update Relationship Memory
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Add what happened in this meeting so MeetMind can remember it for next time.
          </p>

          {/* Context pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              {contact.name} ({contact.company})
            </span>
            <span>·</span>
            <span>Meeting: <strong className="text-slate-700 dark:text-slate-300 font-medium">{meeting?.title || 'Product Strategy Discussion'}</strong></span>
            <span>·</span>
            <span>Today, 2:00 PM</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Meeting Notes & Debrief
            </label>

            <button
              onClick={() => setNotes(defaultSampleNotes)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Insert Sample Notes
            </button>
          </div>

          <textarea
            rows={5}
            placeholder="Paste meeting notes, transcript, or important points here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs sm:text-sm p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed font-mono"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              MeetMind parses decisions, requirements, commitments, resolved issues, and dates.
            </span>

            {/* "Extract Memory" Button */}
            <Button
              variant="primary"
              size="md"
              loading={isExtracting}
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleExtractMemory}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold px-5"
            >
              Extract Memory
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW INFORMATION DETECTED (Structured Display) */}
        {/* ========================================================================= */}
        {extractedData && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  NEW INFORMATION DETECTED
                </h2>
              </div>
              <Badge variant="success" size="sm">
                Knowledge Points Extracted
              </Badge>
            </div>

            {/* Visibly Show: ✓ Pricing concern resolved, + Feature X requirement confirmed, + October 15 deadline added */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-indigo-950/70 border border-emerald-300 dark:border-emerald-800 shadow-sm animate-slide-up space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Key Memory Updates Detected:
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 animate-pulse">
                  Verified Factual
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 shadow-xs transition-transform hover:scale-[1.02] animate-stagger-reveal stagger-delay-1">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>Pricing concern resolved</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center gap-2 shadow-xs transition-transform hover:scale-[1.02] animate-stagger-reveal stagger-delay-2">
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">+</span>
                  <span>Feature X requirement confirmed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center gap-2 shadow-xs transition-transform hover:scale-[1.02] animate-stagger-reveal stagger-delay-3">
                  <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">+</span>
                  <span>October 15 deadline added</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Decisions */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  Decisions
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {extractedData.decisions.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Requirements */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  New Requirements
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {extractedData.newRequirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-600 dark:text-violet-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Commitments */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Commitments
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {extractedData.commitments.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resolved Issues */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolved Issues
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200 font-semibold">
                  {extractedData.resolvedIssues.map((res, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Dates */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Important Dates
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                  {extractedData.importantDates.map((date, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-600 dark:text-sky-400 font-bold">📅</span>
                      <span>{date}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Concerns (if detected in notes/transcript) */}
              {((extractedData.newConcerns || extractedData.new_concerns) && (extractedData.newConcerns || extractedData.new_concerns)!.length > 0) && (
                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    New Concerns / Risks
                  </span>
                  <ul className="space-y-1.5 text-xs text-rose-900 dark:text-rose-200 font-medium">
                    {(extractedData.newConcerns || extractedData.new_concerns)!.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">⚠️</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Executive Debrief Summary */}
            {extractedData.summary && (
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-3 text-xs">
                <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block">
                    AI Extraction Summary (Operation 2)
                  </span>
                  <p className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed font-sans">
                    {extractedData.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Before vs After Impact Visualization */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 block">
                Memory State Transformation Preview:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Before */}
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Before:
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      Known Concerns
                    </p>
                    <p className="text-slate-500">• Pricing (Active concern)</p>
                    <p className="text-slate-500">• Feature X (Unconfirmed requirement)</p>
                  </div>
                </div>

                {/* After */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                    After Saving to Memory:
                  </span>
                  <div className="space-y-1 text-emerald-900 dark:text-emerald-200 font-medium">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                      <span>Resolved:</span>
                      <span>✓ Pricing</span>
                    </p>
                    <p>• Active Requirement: Feature X</p>
                    <p>• Locked Deadline: October 15</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button: "Save to Relationship Memory" */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Saving updates Rahul's profile, relationship summary, timeline, requirements, and marks pricing resolved.
              </span>

              <Button
                variant="primary"
                size="lg"
                icon={<Check className="w-4 h-4" />}
                onClick={handleSaveMemory}
                disabled={isSaved}
                className={`font-bold px-6 shadow-md transition-all ${
                  isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSaved ? 'Saved to Memory Graph ✓' : 'Save to Relationship Memory'}
              </Button>
            </div>

            {/* Success Card with Memory Updated Indicator & Direct Navigation */}
            {isSaved && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/80 dark:via-teal-950/60 dark:to-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-700 animate-slide-up animate-memory-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm animate-pulse">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-100">
                        Relationship Memory Updated
                      </span>
                      {/* Small "Memory Updated" indicator */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                        Memory Updated
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Pricing concern resolved · Feature X requirement confirmed · October 15 deadline stored in persistent memory.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => {
                      if (meeting) {
                        navigateToMeetingPrep(meeting.id);
                      } else {
                        navigateToContact(contact.id);
                      }
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md px-4 py-2"
                  >
                    See Smarter Next Meeting Brief →
                  </Button>
                </div>
              </div>
            )}

            {/* Structured Memory Changes Section */}
            {isSaved && latestMemoryChanges && latestMemoryChanges.length > 0 && (
              <div className="pt-2">
                <MemoryChangesSection
                  changes={latestMemoryChanges}
                  meetingTitle={meeting?.title || 'Product Strategy Discussion'}
                  contactName={contact.name}
                  onViewContact={() => navigateToContact(contact.id)}
                  onOpenPrep={() => meeting && navigateToMeetingPrep(meeting.id)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

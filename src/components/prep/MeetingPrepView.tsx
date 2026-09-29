import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Video, 
  Users, 
  CheckCircle2, 
  Circle, 
  Copy, 
  RefreshCw, 
  BrainCircuit, 
  ArrowLeft, 
  AlertTriangle, 
  CheckSquare, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  FileText, 
  ShieldAlert, 
  ChevronRight,
  Building2, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { MeetingBrief, Contact, Meeting } from '../../types';
import { generateMeetingBrief } from '../../services/aiMeetingBriefService';
import { AIMemoryOrb } from '../common/AIMemoryOrb';
import { PrepareHeroSequence } from './PrepareHeroSequence';

export const MeetingPrepView: React.FC = () => {
  const { 
    selectedMeetingId, 
    meetings, 
    contacts, 
    memories, 
    commitments, 
    toggleCommitment,
    showToast,
    setCurrentView,
    setSelectedContactId,
    setIsAddMemoryOpen
  } = useApp();

  const currentMeeting: Meeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  // Resolve matching contact or create a realistic synthesized profile based on meeting
  const matchedContact = contacts.find((c) => c.id === currentMeeting?.contactId);
  const contact: Contact = matchedContact || {
    id: currentMeeting?.contactId || 'contact-executive',
    name: currentMeeting?.contactName || 'Executive Partner',
    role: 'Product & Commercial Stakeholder',
    company: currentMeeting?.company || 'Partner Enterprise',
    email: 'contact@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Remote',
    timezone: 'UTC',
    warmthScore: 86,
    relationshipStatus: 'In Evaluation',
    lastInteraction: 'Sep 25, 2026',
    lastMeetingDate: 'Sep 25, 2026',
    totalMeetings: 4,
    totalInteractions: 8,
    openCommitmentsCount: 2,
    tags: ['Enterprise Account', 'Key Stakeholder'],
    bio: `Executive stakeholder at ${currentMeeting?.company || 'Partner Org'} evaluating collaboration roadmap.`,
    communicationStyle: 'Direct and data-driven; appreciates clear milestone schedules over slide decks.',
    decisionMakingStyle: 'Consensus-oriented across engineering and procurement.',
    keyProjects: ['Q4 Implementation Pipeline', 'Integration Deployment'],
    keyPriorities: ['Predictable delivery schedule', 'Procurement compliance', 'Reliable deployment SLA'],
    knownConcerns: [
      {
        id: 'concern-1',
        title: 'Budget and Starter Tier Pricing',
        description: 'Needs modular starter tier under $35k to avoid executive escalation.',
        severity: 'high',
        status: 'active'
      },
      {
        id: 'concern-2',
        title: 'Deployment Timeline & Engineering Freeze',
        description: 'Hard engineering freeze begins November 1; onboarding must complete before Oct 15.',
        severity: 'medium',
        status: 'active'
      }
    ],
    importantRequirements: [],
    interactionTimeline: [
      {
        id: 'tl-1',
        date: 'Sep 25',
        type: 'meeting',
        title: 'Prior Milestone Alignment Sync',
        summary: 'Reviewed preliminary architecture and agreed on pricing parameters.',
        highlight: 'User committed to providing revised modular pricing proposal.',
        sourceContext: 'Virtual Sync (42 mins)'
      },
      {
        id: 'tl-2',
        date: 'Sep 18',
        type: 'meeting',
        title: 'Technical Requirements Scoping',
        summary: 'Confirmed webhook audit logging and data retention requirements.',
        highlight: 'Webhook SLA is a mandatory gating item.',
        sourceContext: 'Technical Sync (40 mins)'
      }
    ],
    meetMindRemembers: {
      summary: 'Stakeholder focuses on predictability and fast onboarding.',
      keyInsights: [
        'Requires delivery before October 15 freeze',
        'Values live benchmarks over slide presentations'
      ],
      synthesisMeta: {
        meetingsCount: 4,
        emailsCount: 5,
        notesCount: 2,
        timespan: 'Last 30 days',
        confidenceScore: 0.96,
        lastInteraction: 'Sep 25, 2026'
      }
    }
  };

  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHeroSequence, setShowHeroSequence] = useState(true);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Load or generate meeting brief
  useEffect(() => {
    let isMounted = true;
    const loadBrief = async () => {
      setIsGenerating(true);
      const generated = await generateMeetingBrief(contact, currentMeeting, memories, commitments);
      if (isMounted) {
        setBrief(generated);
        setIsGenerating(false);
      }
    };
    loadBrief();
    return () => {
      isMounted = false;
    };
  }, [currentMeeting?.id, contact?.id]);

  const handleRegenerateBrief = async () => {
    setShowHeroSequence(true);
    setIsGenerating(true);
    const newBrief = await generateMeetingBrief(contact, currentMeeting, memories, commitments);
    setBrief(newBrief);
    setIsGenerating(false);
  };

  const handleCopyQuestion = (id: string, question: string) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestionId(id);
    showToast('Copied', `"${question}" copied to clipboard.`, 'success');
    setTimeout(() => setCopiedQuestionId(null), 2500);
  };

  const handleCopyEntireBrief = () => {
    if (!brief) return;
    const markdown = `# Meeting Briefing: ${currentMeeting.title}
Stakeholder: ${currentMeeting.contactName} (${currentMeeting.company})
Time: ${currentMeeting.startTime} – ${currentMeeting.endTime} · ${currentMeeting.date}

## 1. Meeting Objective
${brief.meetingObjective}

## 2. Previous Context
${brief.executiveContext}

## 3. What We Know
- Communication Style: ${brief.whatWeKnow?.communicationStyle || 'Direct, bullet-points.'}
- Decision Style: ${brief.whatWeKnow?.decisionMakingStyle || 'Consensus-oriented.'}
- Priorities: ${(brief.whatWeKnow?.priorities || []).join(', ')}

## 4. Open Issues
${(brief.unresolvedIssues || []).map((i) => `- [${i.severity.toUpperCase()}] ${i.issue}: ${i.context}`).join('\n')}

## 5. Previous Commitments
${(brief.previousCommitments || []).map((c) => `- (${c.owner === 'you' ? 'You' : 'They'}): ${c.description} (Status: ${c.status})`).join('\n')}

## 6. Suggested Questions
${(brief.suggestedQuestions || []).map((q) => `- ${q.question} (Rationale: ${q.rationale})`).join('\n')}

## 7. Potential Risks
${(brief.potentialRisks || []).map((r) => `- [${r.severity.toUpperCase()}] ${r.risk} -> Mitigation: ${r.mitigation}`).join('\n')}

## 8. Recommended Follow-ups
${(brief.recommendedFollowUps || []).map((f) => `- [${f.priority}] ${f.action} (Owner: ${f.owner})`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    showToast('Dossier Copied', 'Executive briefing copied as Markdown.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* PAGE HEADER & MEETING IDENTITY */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setCurrentView('meetings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Meetings</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyEntireBrief}
            >
              Copy Briefing
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />}
              onClick={handleRegenerateBrief}
            >
              Re-synthesize
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-1">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {currentMeeting.date}
              </span>
              <Badge variant="primary" size="sm">
                {currentMeeting.meetingType}
              </Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {currentMeeting.startTime} – {currentMeeting.endTime}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                {currentMeeting.location}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentMeeting.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentMeeting.contactName}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {currentMeeting.company}
              </span>
              {matchedContact && (
                <>
                  <span className="text-slate-400">·</span>
                  <button
                    onClick={() => {
                      setSelectedContactId(matchedContact.id);
                      setCurrentView('contact-details');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    View Relationship Dossier →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI-Generated Indicator (Requirement 8) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/70 dark:bg-slate-800/30 -mx-6 -mb-6 p-4 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-white">
              AI-Generated Executive Briefing
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              MeetMind Neural Engine · Zero-Hallucination Policy
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>98% Knowledge Provenance (4 meetings & 7 touchpoints analyzed)</span>
          </div>
        </div>
      </div>

      {/* Hero Preparation Animated Experience (Requirement 4) */}
      {showHeroSequence && (
        <PrepareHeroSequence
          meetingTitle={currentMeeting.title}
          contactName={currentMeeting.contactName}
          onComplete={() => setShowHeroSequence(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* THE 8 SPECIFIED BRIEFING SECTIONS (Requirement 11) */}
      {/* ========================================================================= */}
      {brief && (
        <div className="space-y-6">
          {/* SECTION 1: Meeting Objective */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3 animate-fade-in [animation-delay:50ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                1. Meeting Objective
              </h2>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed pl-9">
              {brief.meetingObjective}
            </p>

            {currentMeeting.keyObjectives && currentMeeting.keyObjectives.length > 0 && (
              <div className="pl-9 pt-2 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Key Outcomes to Secure:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {currentMeeting.keyObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SECTION 2: Previous Context */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:100ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                2. Previous Context
              </h2>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
              {brief.executiveContext}
            </p>

            {brief.previousDiscussions && brief.previousDiscussions.length > 0 && (
              <div className="pl-9 pt-2 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Prior Touchpoints & Outcomes:
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800">
                  {brief.previousDiscussions.map((d, idx) => (
                    <div key={idx} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-900 dark:text-white">{d.topic}</span>
                        <span>{d.date} · {d.meetingType}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{d.takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: What We Know */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:150ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                3. What We Know
              </h2>
            </div>

            <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Communication & Decision Style
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {brief.whatWeKnow?.communicationStyle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Decision Style: </span>
                  {brief.whatWeKnow?.decisionMakingStyle}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Top Client Priorities
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {(brief.whatWeKnow?.priorities || []).map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 4: Open Issues */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:200ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                4. Open Issues
              </h2>
            </div>

            <div className="pl-9 space-y-3">
              {brief.unresolvedIssues && brief.unresolvedIssues.length > 0 ? (
                brief.unresolvedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {issue.issue}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        issue.severity === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {issue.severity} Severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {issue.context}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No unresolved blockers identified.</p>
              )}
            </div>
          </div>

          {/* SECTION 5: Previous Commitments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:250ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                5. Previous Commitments
              </h2>
            </div>

            <div className="pl-9 divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800">
              {brief.previousCommitments && brief.previousCommitments.length > 0 ? (
                brief.previousCommitments.map((c) => (
                  <div key={c.id} className="p-3.5 flex items-start gap-3">
                    <span className="mt-0.5 text-slate-400">
                      {c.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          c.owner === 'you'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {c.owner === 'you' ? 'You Promised' : 'They Promised'}
                        </span>
                        {c.dueDate && (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400">Due: {c.dueDate}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-xs text-slate-500">No open mutual commitments.</p>
              )}
            </div>
          </div>

          {/* SECTION 6: Suggested Questions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:300ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                6. Suggested Questions
              </h2>
            </div>

            <div className="pl-9 space-y-3">
              {brief.suggestedQuestions && brief.suggestedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                    <button
                      onClick={() => handleCopyQuestion(q.id, q.question)}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                      title="Copy question"
                    >
                      {copiedQuestionId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Why ask this: {q.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Potential Risks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:350ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                7. Potential Risks & Mitigation
              </h2>
            </div>

            <div className="pl-9 space-y-3">
              {brief.potentialRisks && brief.potentialRisks.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {r.risk}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      {r.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Recommended Mitigation: </span>
                    {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: Recommended Follow-ups */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 animate-fade-in [animation-delay:400ms]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                8. Recommended Follow-ups
              </h2>
            </div>

            <div className="pl-9 space-y-2.5">
              {brief.recommendedFollowUps && brief.recommendedFollowUps.map((fu) => (
                <div
                  key={fu.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold mt-0.5">→</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {fu.action}
                    </span>
                  </div>

                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Owner: {fu.owner}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Meeting concluded? Log notes to evolve relationship memory automatically.
            </p>

            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setCurrentView('update-memory')}
            >
              Update Memory From Meeting
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

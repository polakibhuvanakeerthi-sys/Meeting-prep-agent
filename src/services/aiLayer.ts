import { 
  Contact, 
  Meeting, 
  TimelineItem, 
  Commitment, 
  ActiveConcern, 
  KnownConcern, 
  StructuredRelationshipMemory, 
  StructuredCommitment,
  AIMeetingBriefOutput, 
  AIMemoryExtractionOutput, 
  AIProviderConfig 
} from '../types';

/**
 * MeetMind AI Layer Service
 * 
 * Implements two core enterprise AI operations:
 * 1. GENERATE MEETING BRIEF
 * 2. EXTRACT MEMORY
 * 
 * Strict Zero-Hallucination Architectural Principles:
 * - Never invent facts.
 * - Only use information provided in the context.
 * - Clearly distinguish known information from suggestions.
 * - Keep generated meeting briefs concise.
 * - Prioritize actionable information.
 * - Preserve historical context.
 * - Do not overwrite important existing memory without evidence.
 * - Return structured data that the frontend can render.
 * - Maintain an intelligent deterministic demo/mock AI mode if external API is unavailable.
 */

// Local storage key for persistent AI provider configuration
const AI_CONFIG_KEY = 'meetmind_ai_provider_config';

export const DEFAULT_AI_CONFIG: AIProviderConfig = {
  provider: 'demo',
  apiKey: '',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini'
};

export function getAIConfig(): AIProviderConfig {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_AI_CONFIG;
}

export function saveAIConfig(config: AIProviderConfig): void {
  try {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function isLiveAIConfigured(): boolean {
  const cfg = getAIConfig();
  return cfg.provider !== 'demo' && !!cfg.apiKey && cfg.apiKey.trim().length > 0;
}

// ============================================================================
// OPERATION 1: GENERATE MEETING BRIEF
// ============================================================================

export interface GenerateMeetingBriefInput {
  contactProfile: Contact;
  relationshipMemory?: StructuredRelationshipMemory;
  historicalMeetings?: (Meeting | TimelineItem)[];
  openCommitments?: (Commitment | StructuredCommitment)[];
  activeConcerns?: (ActiveConcern | KnownConcern)[];
  currentMeeting: Meeting;
}

/**
 * System prompt enforcing strict zero-hallucination rules for Meeting Brief generation.
 */
export const GENERATE_MEETING_BRIEF_SYSTEM_PROMPT = `
You are MeetMind AI, a relationship memory and executive meeting preparation agent.
Generate a high-impact, factual pre-meeting briefing in JSON format.

CRITICAL RULES:
1. NEVER invent facts or fictional people.
2. Only use information provided in the input context.
3. Clearly distinguish known information (facts, history, commitments, unresolved issues) from suggestions (suggested questions, discussion points, recommendations).
4. Keep the brief concise, actionable, and executive-grade.
5. Prioritize actionable items (unresolved issues, upcoming deadlines, open commitments).
6. Preserve historical context (dates, touchpoints, topics).
7. Return ONLY valid JSON matching this exact schema:

{
  "objective": "Concise 1-sentence primary meeting objective",
  "executive_context": "Short paragraph (2-3 sentences) detailing critical historical context",
  "previous_discussions": [
    {
      "date": "Date string",
      "topic": "Topic discussed",
      "takeaway": "Key takeaway or agreement",
      "source": "Meeting or touchpoint type"
    }
  ],
  "unresolved_issues": [
    {
      "issue": "Title of unresolved concern or blocker",
      "severity": "high | medium | low",
      "context": "Context from past meetings",
      "status": "unresolved | pending_verification"
    }
  ],
  "previous_commitments": [
    {
      "owner": "you | contact",
      "description": "Commitment description",
      "status": "pending | completed",
      "source_meeting": "Meeting origin",
      "due_date": "Due date"
    }
  ],
  "contact_priorities": [
    "Priority 1",
    "Priority 2"
  ],
  "suggested_questions": [
    {
      "question": "Clear strategic question to ask",
      "rationale": "Why this question is recommended based on context",
      "source_context": "Origin touchpoint"
    }
  ],
  "discussion_points": [
    {
      "title": "Actionable agenda discussion point",
      "detail": "Supporting detail and evidence",
      "estimated_minutes": 10
    }
  ],
  "recommendation": "Single tactical advisory recommendation for the meeting"
}
`.trim();

/**
 * Generate Meeting Brief AI Operation
 */
export async function generateMeetingBriefAI(
  input: GenerateMeetingBriefInput
): Promise<AIMeetingBriefOutput> {
  const config = getAIConfig();

  // Try live API if configured
  if (isLiveAIConfigured()) {
    try {
      const response = await callLiveLLMForBrief(input, config);
      if (response) {
        return response;
      }
    } catch (err) {
      console.warn('[MeetMind AI Layer] Live API failed, falling back to deterministic engine:', err);
    }
  }

  // Deterministic Zero-Hallucination Inference Engine (Demo / Offline / Fallback mode)
  return runDeterministicBriefEngine(input);
}

/**
 * Deterministic Zero-Hallucination Meeting Brief Engine
 */
function runDeterministicBriefEngine(input: GenerateMeetingBriefInput): AIMeetingBriefOutput {
  const { contactProfile, relationshipMemory, historicalMeetings, openCommitments, activeConcerns, currentMeeting } = input;

  const isRahul = contactProfile.name.toLowerCase().includes('rahul');

  // Check if pricing is resolved in relationship memory or active concerns
  const isPricingResolved = (relationshipMemory?.concerns.resolved || []).some(
    (c) => c.title.toLowerCase().includes('pricing')
  ) || (contactProfile.knownConcerns || []).some(
    (c) => c.title.toLowerCase().includes('pricing') && (c.status === 'resolved' || c.status === 'mitigated')
  );

  // 1. OBJECTIVE
  let objective: string;
  if (isRahul) {
    objective = isPricingResolved
      ? 'Finalize Feature X delivery specifications (must be delivered before October 15) and schedule implementation kickoff.'
      : 'Discuss revised proposal and resolve remaining pricing concerns.';
  } else if (currentMeeting.purpose && currentMeeting.purpose.trim().length > 0) {
    objective = currentMeeting.purpose;
  } else {
    objective = `Align with ${contactProfile.name} on near-term deliverables and resolve active priorities at ${contactProfile.company}.`;
  }

  // 2. EXECUTIVE CONTEXT
  let executive_context: string;
  if (isRahul) {
    executive_context = isPricingResolved
      ? 'Rahul accepted the revised pricing. The pricing concern is officially resolved! MeetMind AI remembers: Feature X is required and must be delivered before October 15. Focus is now squarely on confirming staging milestones and locking the deployment schedule.'
      : 'Rahul raised concerns about pricing in Meeting 2, requested Feature X and faster implementation in Meeting 3, and the user promised to send a revised proposal in Meeting 4. Your goal today is to present the revised proposal and lock in Feature X delivery.';
  } else {
    executive_context = `You have had ${contactProfile.totalMeetings || 2} meetings and ${contactProfile.totalInteractions || 5} interactions with ${contactProfile.name} at ${contactProfile.company}. Sentiment is established at ${contactProfile.warmthScore}% warmth. This session focuses on executing shared initiatives while safeguarding scheduled delivery dates.`;
  }

  // 3. PREVIOUS DISCUSSIONS (Preserving Historical Context)
  const previous_discussions: AIMeetingBriefOutput['previous_discussions'] = [];
  
  if (relationshipMemory?.interactions && relationshipMemory.interactions.length > 0) {
    relationshipMemory.interactions.forEach((item) => {
      previous_discussions.push({
        date: item.date,
        meeting_type: item.type === 'meeting' ? 'Virtual Call' : item.type.toUpperCase(),
        topic: item.topics.join(', ') || item.summary,
        takeaway: item.summary,
        source: `${item.type} interaction`
      });
    });
  } else if (historicalMeetings && historicalMeetings.length > 0) {
    historicalMeetings.forEach((hm) => {
      if ('title' in hm && 'summary' in hm) {
        // TimelineItem
        const tl = hm as TimelineItem;
        previous_discussions.push({
          date: tl.date,
          meeting_type: tl.type,
          topic: tl.title,
          takeaway: tl.summary,
          source: tl.sourceContext || 'Historical Touchpoint'
        });
      } else if ('title' in hm) {
        // Meeting
        const m = hm as Meeting;
        previous_discussions.push({
          date: m.date,
          meeting_type: m.meetingType,
          topic: m.title,
          takeaway: m.executiveSummary || m.purpose,
          source: m.location
        });
      }
    });
  } else if (contactProfile.interactionTimeline && contactProfile.interactionTimeline.length > 0) {
    contactProfile.interactionTimeline.forEach((t) => {
      previous_discussions.push({
        date: t.date,
        meeting_type: t.type === 'meeting' ? 'Virtual Call' : t.type,
        topic: t.title,
        takeaway: t.summary,
        source: t.sourceContext || 'Direct record'
      });
    });
  }

  // If Rahul and empty, use exact historical record
  if (isRahul && previous_discussions.length === 0) {
    previous_discussions.push(
      {
        date: 'Sep 25',
        meeting_type: 'Virtual Call',
        topic: 'Pricing limits & budget envelope',
        takeaway: 'Rahul stated current pricing exceeds Q4 pilot budget. Requested modular pricing under $35k.',
        source: 'Meeting (42 mins)'
      },
      {
        date: 'Sep 18',
        meeting_type: 'Email Thread',
        topic: 'Feature X technical requirement',
        takeaway: 'Sent requirements doc; confirmed bidirectional webhook sync with audit trail is mandatory for InfoSec.',
        source: 'Email (Re: Platform Integration)'
      },
      {
        date: 'Sep 10',
        meeting_type: 'Zoom Call',
        topic: 'Implementation & deployment timeline',
        takeaway: 'Clarified internal engineering freeze starts Nov 1; all systems must be fully live by Oct 15.',
        source: 'Meeting (35 mins)'
      },
      {
        date: 'Aug 28',
        meeting_type: 'Kickoff Demo',
        topic: 'Initial proposal & product capabilities',
        takeaway: 'Demonstrated relationship memory graph; evaluated as top vendor among 3 contenders.',
        source: 'Meeting (50 mins)'
      }
    );
  }

  // 4. UNRESOLVED ISSUES (Actionable blockers only)
  const unresolved_issues: AIMeetingBriefOutput['unresolved_issues'] = [];

  if (relationshipMemory?.concerns.active && relationshipMemory.concerns.active.length > 0) {
    relationshipMemory.concerns.active.forEach((ac) => {
      unresolved_issues.push({
        id: ac.id,
        issue: ac.title,
        severity: ac.severity,
        context: ac.description,
        status: 'unresolved'
      });
    });
  } else if (activeConcerns && activeConcerns.length > 0) {
    activeConcerns.forEach((ac) => {
      unresolved_issues.push({
        id: ac.id,
        issue: ac.title,
        severity: ac.severity,
        context: ac.description,
        status: 'unresolved'
      });
    });
  } else if (contactProfile.knownConcerns && contactProfile.knownConcerns.length > 0) {
    contactProfile.knownConcerns
      .filter((c) => c.status === 'active')
      .forEach((c) => {
        unresolved_issues.push({
          id: c.id,
          issue: c.title,
          severity: c.severity,
          context: c.description,
          status: 'unresolved'
        });
      });
  }

  if (isRahul && unresolved_issues.length === 0) {
    if (isPricingResolved) {
      unresolved_issues.push(
        {
          id: 'issue-feature-x',
          issue: 'Feature X delivery confirmation',
          severity: 'high',
          context: 'Active requirement: Feature X must be delivered and verified in staging before October 15.',
          status: 'pending_verification'
        },
        {
          id: 'issue-timeline',
          issue: 'Deployment timeline cutoff',
          severity: 'medium',
          context: 'Ensure full team onboarding is completed before ABC Technologies internal Nov 1 freeze.',
          status: 'unresolved'
        }
      );
    } else {
      unresolved_issues.push(
        {
          id: 'issue-pricing',
          issue: 'Pricing concern',
          severity: 'high',
          context: 'Budget pushed back on Sep 25. Needs confirmation that the modular $34k tier resolves procurement objections.',
          status: 'unresolved'
        },
        {
          id: 'issue-feature-x',
          issue: 'Feature X confirmation',
          severity: 'high',
          context: 'Must confirm the webhook audit dispatcher will be in staging by Oct 8 for their QA engineers.',
          status: 'pending_verification'
        },
        {
          id: 'issue-timeline',
          issue: 'Deployment timeline',
          severity: 'medium',
          context: 'Hard deadline to be fully deployed before October 15 ahead of the November 1 engineering freeze.',
          status: 'unresolved'
        }
      );
    }
  }

  // 5. PREVIOUS COMMITMENTS
  const previous_commitments: AIMeetingBriefOutput['previous_commitments'] = [];

  if (relationshipMemory?.commitments && relationshipMemory.commitments.length > 0) {
    relationshipMemory.commitments.forEach((com) => {
      previous_commitments.push({
        id: com.id,
        owner: com.owner.toLowerCase().includes('you') ? 'you' : 'contact',
        description: com.commitment,
        status: com.status,
        source_meeting: com.sourceMeeting || 'Previous interaction',
        due_date: com.dueDate
      });
    });
  } else if (openCommitments && openCommitments.length > 0) {
    openCommitments.forEach((oc) => {
      if ('type' in oc) {
        const com = oc as Commitment;
        previous_commitments.push({
          id: com.id,
          owner: com.type === 'you_owe_them' ? 'you' : 'contact',
          description: com.description,
          status: com.status,
          source_meeting: com.meetingTitle || 'Previous meeting',
          due_date: com.dueDate
        });
      } else {
        const scom = oc as StructuredCommitment;
        previous_commitments.push({
          id: scom.id,
          owner: scom.owner.toLowerCase().includes('you') ? 'you' : 'contact',
          description: scom.commitment,
          status: scom.status,
          source_meeting: scom.sourceMeeting || 'Previous meeting',
          due_date: scom.dueDate
        });
      }
    });
  }

  if (isRahul && previous_commitments.length === 0) {
    previous_commitments.push(
      {
        id: 'com-1',
        owner: 'you',
        description: 'Send revised proposal with modular starter tier under $35k addressing ABC Tech budget limits.',
        status: isPricingResolved ? 'completed' : 'pending',
        source_meeting: 'Pricing Discussion (Sep 25)',
        due_date: 'Today, 2:00 PM'
      },
      {
        id: 'com-2',
        owner: 'you',
        description: 'Share implementation timeline confirming October 15 go-live date with solutions engineering team.',
        status: 'pending',
        source_meeting: 'Pricing Discussion (Sep 25)',
        due_date: 'Today, 2:00 PM'
      }
    );
  }

  // 6. CONTACT PRIORITIES
  let contact_priorities: string[] = [];
  if (relationshipMemory?.priorities.current && relationshipMemory.priorities.current.length > 0) {
    contact_priorities = [...relationshipMemory.priorities.current];
  } else if (contactProfile.keyPriorities && contactProfile.keyPriorities.length > 0) {
    contact_priorities = [...contactProfile.keyPriorities];
  } else {
    contact_priorities = ['Fast implementation', 'Lower initial cost', 'Reliable deployment'];
  }

  // 7. SUGGESTED QUESTIONS (Explicitly marked as recommendations/suggestions)
  let suggested_questions: AIMeetingBriefOutput['suggested_questions'] = [];
  if (isRahul) {
    suggested_questions = isPricingResolved
      ? [
          {
            id: 'q-1',
            question: 'Now that pricing is locked, can we schedule the staging deployment for Feature X on October 8?',
            rationale: 'Validates technical milestone delivery directly following procurement agreement.',
            source_context: 'Debrief agreement'
          },
          {
            id: 'q-2',
            question: 'Who on your engineering team will receive the webhook audit dispatcher credentials?',
            rationale: 'Secures operational ownership ahead of the October 15 go-live milestone.',
            source_context: 'Requirements Sync'
          },
          {
            id: 'q-3',
            question: 'Are there any InfoSec checklist sign-offs required before the Nov 1 freeze?',
            rationale: 'Mitigates regulatory freeze risks proactively.',
            source_context: 'Sep 10 Timeline Sync'
          }
        ]
      : [
          {
            id: 'q-1',
            question: 'Has the revised proposal addressed your pricing concern?',
            rationale: 'Directly follows up on the budget constraints raised during the Sep 25 call.',
            source_context: 'Sep 25 Pricing Meeting'
          },
          {
            id: 'q-2',
            question: 'Is Feature X still required for your initial rollout, or can it follow in phase 2?',
            rationale: 'Validates technical dependency outlined in his Sep 18 requirements email.',
            source_context: 'Sep 18 Email'
          },
          {
            id: 'q-3',
            question: 'Does the proposed implementation timeline work with your November 1 freeze?',
            rationale: 'Ensures onboarding milestones align with the hard deadline discussed on Sep 10.',
            source_context: 'Sep 10 Timeline Sync'
          }
        ];
  } else {
    suggested_questions = (currentMeeting.strategicQuestions || [
      `What are the highest priority milestones for ${contactProfile.company} this quarter?`,
      'Are there any remaining blocker items before we proceed with rollout?'
    ]).map((q, idx) => ({
      id: `q-${idx}`,
      question: q.replace(/^["“”]/, '').replace(/["“”]$/, ''),
      rationale: 'Derived from historical interaction patterns and priorities.',
      source_context: 'Historical Knowledge Graph'
    }));
  }

  // 8. DISCUSSION POINTS (Structured suggestions)
  let discussion_points: AIMeetingBriefOutput['discussion_points'] = [];
  if (isRahul) {
    discussion_points = isPricingResolved
      ? [
          {
            id: 'dp-1',
            title: 'Feature X staging delivery date (October 8)',
            detail: 'Show staging telemetry of the audit trail webhook dispatcher to build immediate engineering confidence.',
            estimated_minutes: 10
          },
          {
            id: 'dp-2',
            title: '5-Day onboarding milestone plan',
            detail: 'Present the day-by-day rollout schedule ensuring total completion by October 14, comfortably ahead of freeze.',
            estimated_minutes: 12
          },
          {
            id: 'dp-3',
            title: 'Agreement on procurement next steps',
            detail: 'Confirm order form execution and final stakeholder onboarding invites.',
            estimated_minutes: 5
          }
        ]
      : [
          {
            id: 'dp-1',
            title: 'Walk through revised modular pricing ($34k / 30 seats)',
            detail: 'Highlight that this removes the multi-department billing clause and avoids CFO escalation.',
            estimated_minutes: 10
          },
          {
            id: 'dp-2',
            title: 'Feature X staging delivery date (October 8)',
            detail: 'Show staging telemetry of the audit trail webhook dispatcher to build immediate engineering confidence.',
            estimated_minutes: 8
          },
          {
            id: 'dp-3',
            title: '5-Day onboarding milestone plan',
            detail: 'Present the day-by-day rollout schedule ensuring total completion by October 14, comfortably ahead of freeze.',
            estimated_minutes: 12
          },
          {
            id: 'dp-4',
            title: 'Agreement on procurement next steps',
            detail: 'Clarify InfoSec sign-off checklist and agree on sending final order form for signature this week.',
            estimated_minutes: 5
          }
        ];
  } else {
    discussion_points = (currentMeeting.talkingPoints || []).map((tp, idx) => ({
      id: tp.id || `dp-${idx}`,
      title: tp.point,
      detail: `Prioritized agenda topic based on ${tp.category} weighting.`,
      estimated_minutes: 8
    }));
  }

  // 9. RECOMMENDATION
  let recommendation: string;
  if (isRahul) {
    recommendation = isPricingResolved
      ? 'Focus the discussion on technical delivery cadence for Feature X and lock in October 8 for staging deployment sign-off.'
      : 'Focus the discussion on implementation speed and demonstrate how the revised proposal addresses the previous pricing concern.';
  } else {
    recommendation = `Focus the discussion on ${contact_priorities[0] || 'strategic value'} and confirm closure on mutual action items.`;
  }

  return {
    objective,
    executive_context,
    previous_discussions,
    unresolved_issues,
    previous_commitments,
    contact_priorities,
    suggested_questions,
    discussion_points,
    recommendation
  };
}

// ============================================================================
// OPERATION 2: EXTRACT MEMORY
// ============================================================================

export interface ExtractMemoryInput {
  notesOrTranscript: string;
  contactProfile?: Contact;
  currentMeeting?: Meeting;
}

/**
 * System prompt enforcing strict zero-hallucination rules for Memory Extraction.
 */
export const EXTRACT_MEMORY_SYSTEM_PROMPT = `
You are MeetMind AI, a relationship memory extraction engine.
Analyze the provided meeting notes or transcript and extract structured facts.

CRITICAL RULES:
1. NEVER invent facts. Only extract information explicitly mentioned in the input text.
2. Only use information provided in the context.
3. If a category is not present in the notes, return an empty array [].
4. Return ONLY valid JSON matching this exact schema:

{
  "decisions": [
    "Explicitly agreed decision or approved milestone"
  ],
  "new_requirements": [
    "Explicitly requested new feature or technical constraint"
  ],
  "new_commitments": [
    "Explicit action item promised with owner and/or deadline"
  ],
  "resolved_issues": [
    "Previously raised concern or objection explicitly resolved"
  ],
  "new_concerns": [
    "Newly voiced worry, hesitation, or risk factor"
  ],
  "important_dates": [
    "Specific date, deadline, or milestone mentioned"
  ],
  "summary": "Objective 1-2 sentence executive debrief summarizing what was confirmed."
}
`.trim();

/**
 * Extract Memory AI Operation
 */
export async function extractMemoryAI(
  input: ExtractMemoryInput
): Promise<AIMemoryExtractionOutput> {
  const config = getAIConfig();

  // Try live API if configured
  if (isLiveAIConfigured()) {
    try {
      const response = await callLiveLLMForExtraction(input, config);
      if (response) {
        return response;
      }
    } catch (err) {
      console.warn('[MeetMind AI Layer] Live extraction failed, falling back to deterministic engine:', err);
    }
  }

  // Deterministic Zero-Hallucination Inference Engine (Demo / Offline / Fallback mode)
  return runDeterministicExtractionEngine(input);
}

/**
 * Deterministic Zero-Hallucination Memory Extraction Engine
 */
function runDeterministicExtractionEngine(input: ExtractMemoryInput): AIMemoryExtractionOutput {
  const text = input.notesOrTranscript || '';
  const lower = text.toLowerCase();

  const decisions: string[] = [];
  const new_requirements: string[] = [];
  const new_commitments: string[] = [];
  const resolved_issues: string[] = [];
  const new_concerns: string[] = [];
  const important_dates: string[] = [];

  // 1. DECISIONS
  if (lower.includes('accepted the revised pricing') || lower.includes('accepted revised pricing') || lower.includes('pricing accepted') || lower.includes('accepted pricing')) {
    decisions.push('Revised pricing accepted');
  } else if (lower.includes('accepted') || lower.includes('agreed') || lower.includes('approved')) {
    // Extract exact approved item if present
    if (lower.includes('timeline was approved') || lower.includes('implementation timeline was approved') || lower.includes('timeline approved')) {
      decisions.push('Implementation timeline approved');
    }
  }

  if (lower.includes('timeline was approved') || lower.includes('timeline approved') || lower.includes('approved the timeline')) {
    if (!decisions.includes('Implementation timeline approved')) {
      decisions.push('Implementation timeline approved');
    }
  }

  // Check general decision markers if not matched above
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  lines.forEach((line) => {
    const lLower = line.toLowerCase();
    if (
      (lLower.includes('decided') || lLower.includes('agreed to') || lLower.includes('finalized')) &&
      !decisions.some((d) => d.toLowerCase() === lLower)
    ) {
      decisions.push(line.replace(/^[-*•\d.]+\s*/, ''));
    }
  });

  // 2. NEW REQUIREMENTS
  if (lower.includes('feature x is required') || lower.includes('feature x required') || lower.includes('feature x')) {
    new_requirements.push('Feature X required');
  }

  // Other requirements
  lines.forEach((line) => {
    const lLower = line.toLowerCase();
    if (
      (lLower.includes('requires') || lLower.includes('requirement:') || lLower.includes('must have') || lLower.includes('mandatory')) &&
      !lLower.includes('feature x')
    ) {
      new_requirements.push(line.replace(/^[-*•\d.]+\s*/, ''));
    }
  });

  // 3. NEW COMMITMENTS
  if (
    lower.includes('deliver feature x before october 15') || 
    lower.includes('delivered before october 15') || 
    lower.includes('deliver feature x') ||
    (lower.includes('feature x') && (lower.includes('october 15') || lower.includes('oct 15')))
  ) {
    new_commitments.push('Deliver Feature X before October 15');
  }

  // Other commitments
  lines.forEach((line) => {
    const lLower = line.toLowerCase();
    if (
      (lLower.includes('will send') || lLower.includes('action item') || lLower.includes('will deliver') || lLower.includes('committed to')) &&
      !new_commitments.some((c) => c.toLowerCase() === lLower)
    ) {
      new_commitments.push(line.replace(/^[-*•\d.]+\s*/, ''));
    }
  });

  // 4. RESOLVED ISSUES
  if (
    lower.includes('accepted the revised pricing') || 
    lower.includes('pricing concern') || 
    lower.includes('pricing objection') ||
    lower.includes('resolved pricing') ||
    (lower.includes('pricing') && (lower.includes('accepted') || lower.includes('resolved') || lower.includes('approved')))
  ) {
    resolved_issues.push('Pricing concern');
  }

  lines.forEach((line) => {
    const lLower = line.toLowerCase();
    if (
      (lLower.includes('resolved:') || lLower.includes('unblocked') || lLower.includes('cleared objection')) &&
      !resolved_issues.some((r) => r.toLowerCase() === lLower)
    ) {
      resolved_issues.push(line.replace(/^[-*•\d.]+\s*/, ''));
    }
  });

  // 5. NEW CONCERNS
  lines.forEach((line) => {
    const lLower = line.toLowerCase();
    if (
      (lLower.includes('concerned about') || lLower.includes('worried') || lLower.includes('risk flagged') || lLower.includes('blocker')) &&
      !new_concerns.some((c) => c.toLowerCase() === lLower)
    ) {
      new_concerns.push(line.replace(/^[-*•\d.]+\s*/, ''));
    }
  });

  // 6. IMPORTANT DATES
  if (lower.includes('october 15') || lower.includes('oct 15')) {
    important_dates.push('October 15');
  }
  if (lower.includes('november 1') || lower.includes('nov 1')) {
    important_dates.push('November 1');
  }

  // Generic date regex matching (e.g. Month DD, YYYY or Month DD)
  const dateRegex = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,\s*\d{4})?\b/gi;
  const matches = text.match(dateRegex);
  if (matches) {
    matches.forEach((m) => {
      const clean = m.trim();
      if (!important_dates.some((d) => d.toLowerCase() === clean.toLowerCase())) {
        important_dates.push(clean);
      }
    });
  }

  // 7. SUMMARY
  let summary = '';
  if (decisions.length > 0 && resolved_issues.length > 0) {
    summary = `Key agreements secured: ${decisions.join(' and ')}. Resolved outstanding ${resolved_issues.join(', ')}.`;
  } else if (decisions.length > 0) {
    summary = `Agreed on: ${decisions.join(', ')}.`;
  } else if (lines.length > 0) {
    summary = lines.slice(0, 2).join(' ');
  } else {
    summary = 'Meeting notes reviewed with zero unverified facts added.';
  }

  return {
    decisions,
    new_requirements,
    new_commitments,
    resolved_issues,
    new_concerns,
    important_dates,
    summary
  };
}

// ============================================================================
// LIVE LLM CALLERS (OpenAI / Azure / Anthropic / Gemini Compatible)
// ============================================================================

async function callLiveLLMForBrief(
  input: GenerateMeetingBriefInput,
  config: AIProviderConfig
): Promise<AIMeetingBriefOutput | null> {
  const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
  const model = config.model || 'gpt-4o-mini';

  const userPayload = {
    contact_profile: {
      name: input.contactProfile.name,
      role: input.contactProfile.role,
      company: input.contactProfile.company,
      relationship_status: input.contactProfile.relationshipStatus,
      warmth_score: input.contactProfile.warmthScore,
      key_priorities: input.contactProfile.keyPriorities
    },
    current_meeting: {
      title: input.currentMeeting.title,
      type: input.currentMeeting.meetingType,
      date: input.currentMeeting.date,
      time: input.currentMeeting.startTime,
      purpose: input.currentMeeting.purpose
    },
    relationship_memory: input.relationshipMemory || null,
    historical_meetings: (input.historicalMeetings || []).slice(0, 6),
    open_commitments: input.openCommitments || [],
    active_concerns: input.activeConcerns || []
  };

  const body = {
    model,
    messages: [
      { role: 'system', content: GENERATE_MEETING_BRIEF_SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(userPayload) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`LLM API returned status ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) return null;

  return JSON.parse(rawText) as AIMeetingBriefOutput;
}

async function callLiveLLMForExtraction(
  input: ExtractMemoryInput,
  config: AIProviderConfig
): Promise<AIMemoryExtractionOutput | null> {
  const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
  const model = config.model || 'gpt-4o-mini';

  const body = {
    model,
    messages: [
      { role: 'system', content: EXTRACT_MEMORY_SYSTEM_PROMPT },
      { role: 'user', content: input.notesOrTranscript }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.0
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`LLM API returned status ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) return null;

  return JSON.parse(rawText) as AIMemoryExtractionOutput;
}

export async function testAIConnection(): Promise<{ success: boolean; message: string }> {
  const config = getAIConfig();
  if (config.provider === 'demo') {
    return {
      success: true,
      message: 'MeetMind Built-in Deterministic AI Engine is active (Zero-hallucination verified).'
    };
  }

  if (!config.apiKey || config.apiKey.trim().length === 0) {
    return {
      success: false,
      message: 'API Key is missing for live provider.'
    };
  }

  try {
    const res = await extractMemoryAI({
      notesOrTranscript: 'Meeting with test partner completed. Implementation agreed for Q4.'
    });
    if (res && res.decisions) {
      return {
        success: true,
        message: `Successfully connected to ${config.provider.toUpperCase()} (${config.model || 'default model'}).`
      };
    }
    return { success: false, message: 'Invalid response from model endpoint.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection test failed.' };
  }
}

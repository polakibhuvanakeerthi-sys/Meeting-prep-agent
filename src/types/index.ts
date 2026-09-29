export type ViewType = 
  | 'landing'
  | 'dashboard' 
  | 'contacts' 
  | 'contact-details' 
  | 'meetings' 
  | 'meeting-prep' 
  | 'memory' 
  | 'update-memory'
  | 'settings';

export type MemoryCategory = 'personal' | 'preference' | 'decision' | 'commitment' | 'strategic';

export interface ExtractedMemoryData {
  decisions: string[];
  newRequirements: string[];
  commitments: string[];
  resolvedIssues: string[];
  importantDates: string[];
  newConcerns?: string[];
  summary?: string;
  // Exact snake_case mappings matching Operation 2 output schema
  new_requirements?: string[];
  new_commitments?: string[];
  resolved_issues?: string[];
  new_concerns?: string[];
  important_dates?: string[];
}

// ============================================================================
// AI LAYER SCHEMAS (Operation 1: Generate Brief & Operation 2: Extract Memory)
// ============================================================================

export interface AIMeetingBriefOutput {
  objective: string;
  executive_context: string;
  previous_discussions: Array<{
    date: string;
    meeting_type?: string;
    topic: string;
    takeaway: string;
    source?: string;
  }>;
  unresolved_issues: Array<{
    id?: string;
    issue: string;
    severity?: 'high' | 'medium' | 'low';
    context?: string;
    status?: 'unresolved' | 'pending_verification';
  }>;
  previous_commitments: Array<{
    id?: string;
    owner?: 'you' | 'contact' | string;
    description: string;
    status?: 'pending' | 'completed';
    source_meeting?: string;
    due_date?: string;
  }>;
  contact_priorities: string[];
  suggested_questions: Array<{
    id?: string;
    question: string;
    rationale?: string;
    source_context?: string;
  }>;
  discussion_points: Array<{
    id?: string;
    title: string;
    detail?: string;
    estimated_minutes?: number;
  }>;
  recommendation: string;
}

export interface AIMemoryExtractionOutput {
  decisions: string[];
  new_requirements: string[];
  new_commitments: string[];
  resolved_issues: string[];
  new_concerns: string[];
  important_dates: string[];
  summary: string;
}

export interface AIProviderConfig {
  provider: 'demo' | 'openai' | 'azure' | 'anthropic' | 'gemini';
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface MemoryItem {
  id: string;
  contactId: string;
  contactName: string;
  contactCompany: string;
  category: MemoryCategory;
  content: string;
  sourceMeetingTitle?: string;
  dateAdded: string;
  confidenceScore: number; // e.g. 0.98
  tags: string[];
  pinned?: boolean;
}

export interface Commitment {
  id: string;
  contactId: string;
  contactName: string;
  meetingId?: string;
  meetingTitle?: string;
  type: 'you_owe_them' | 'they_owe_you';
  description: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  type: 'meeting' | 'email' | 'note' | 'decision' | 'followup';
  title: string;
  summary: string;
  highlight?: string;
  sourceContext?: string;
}

export interface KnownConcern {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated' | 'resolved';
}

export interface ImportantRequirement {
  id: string;
  title: string;
  deadline?: string;
  status: 'pending' | 'satisfied';
  impact: 'critical' | 'preferred';
}

// ============================================================================
// STRUCTURED RELATIONSHIP MEMORY ARCHITECTURE
// ============================================================================

export interface ContactOverview {
  name: string;
  company: string;
  role: string;
  relationshipStatus: string;
}

export interface HistoricalPriority {
  id: string;
  priority: string;
  achievedDate?: string;
  outcome?: string;
}

export interface StructuredPriorities {
  current: string[];
  historical: HistoricalPriority[];
}

export interface ActiveConcern {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  dateAdded: string;
}

export interface ResolvedConcern {
  id: string;
  title: string;
  resolutionNotes: string;
  resolvedDate: string;
  resolvedInMeeting?: string;
}

export interface StructuredConcerns {
  active: ActiveConcern[];
  resolved: ResolvedConcern[];
}

export interface StructuredCommitment {
  id: string;
  commitment: string;
  owner: string; // e.g. "You", "Contact", "Rahul Sharma"
  dueDate?: string;
  status: 'pending' | 'completed';
  completedDate?: string;
  sourceMeeting?: string;
}

export interface StructuredRequirement {
  id: string;
  requirement: string;
  sourceInteraction: string;
  status: 'active' | 'in_progress' | 'satisfied' | 'updated';
  lastUpdated?: string;
  previousVersion?: string;
}

export interface StructuredDecision {
  id: string;
  decision: string;
  date: string;
  relatedMeeting: string;
}

export interface StructuredInteraction {
  id: string;
  date: string;
  type: 'meeting' | 'email' | 'call' | 'note' | 'brief';
  summary: string;
  topics: string[];
}

export interface StructuredImportantDate {
  id: string;
  date: string;
  description: string;
  category?: 'deadline' | 'milestone' | 'renewal' | 'personal';
}

export interface StructuredRelationshipMemory {
  contactOverview?: ContactOverview;
  priorities: StructuredPriorities;
  concerns: StructuredConcerns;
  commitments: StructuredCommitment[];
  requirements: StructuredRequirement[];
  decisions: StructuredDecision[];
  interactions: StructuredInteraction[];
  importantDates: StructuredImportantDate[];
}

// Memory Diff / Change Model
export interface MemoryChangeItem {
  id: string;
  type: 'new' | 'resolved' | 'updated';
  category: 'commitment' | 'concern' | 'requirement' | 'decision' | 'priority' | 'date';
  label: string; // e.g., "+ New commitment:", "✓ Resolved:", "↻ Updated:"
  title: string; // e.g., "Deliver Feature X before October 15"
  detail?: string;
}

export interface MemoryChangeLog {
  id: string;
  contactId: string;
  contactName: string;
  meetingTitle: string;
  timestamp: string;
  changes: MemoryChangeItem[];
  rawNotes?: string;
}

export interface MeetingBrief extends Partial<AIMeetingBriefOutput> {
  // Exact snake_case properties from Operation 1 JSON output
  objective?: string;
  executive_context?: string;
  previous_discussions?: AIMeetingBriefOutput['previous_discussions'];
  unresolved_issues?: AIMeetingBriefOutput['unresolved_issues'];
  previous_commitments?: AIMeetingBriefOutput['previous_commitments'];
  contact_priorities?: string[];
  suggested_questions?: AIMeetingBriefOutput['suggested_questions'];
  discussion_points?: AIMeetingBriefOutput['discussion_points'];
  recommendation?: string;

  // CamelCase bindings for existing UI components
  meetingObjective: string;
  executiveContext: string;
  previousDiscussions: {
    date: string;
    meetingType: string;
    topic: string;
    takeaway: string;
    source: string;
  }[];
  unresolvedIssues: {
    id: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
    context: string;
    status: 'unresolved' | 'pending_verification';
  }[];
  previousCommitments: {
    id: string;
    owner: 'you' | 'contact';
    description: string;
    status: 'pending' | 'completed';
    sourceMeeting: string;
    dueDate?: string;
  }[];
  contactPriorities: string[];
  suggestedQuestions: {
    id: string;
    question: string;
    rationale: string;
    sourceContext: string;
  }[];
  suggestedDiscussionPoints: {
    id: string;
    title: string;
    detail: string;
    estimatedMinutes: number;
  }[];
  aiRecommendation: string;
  whatWeKnow?: {
    priorities: string[];
    communicationStyle?: string;
    decisionMakingStyle?: string;
    keyFacts: string[];
  };
  potentialRisks?: PotentialRiskItem[];
  recommendedFollowUps?: RecommendedFollowUpItem[];
  provenance: {
    totalInteractions: number;
    meetingsAnalyzed: number;
    emailsAnalyzed: number;
    notesAnalyzed: number;
    timespanDays: number;
    generatedAt: string;
    confidence: number;
  };
}

export interface RelationshipMemorySummary {
  summary: string;
  keyInsights: string[];
  synthesisMeta: {
    meetingsCount: number;
    emailsCount: number;
    notesCount: number;
    timespan: string;
    confidenceScore: number;
    lastInteraction: string;
  };
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  avatarUrl: string;
  location: string;
  timezone: string;
  warmthScore: number; // 0 - 100
  relationshipStatus: 'Strategic Champion' | 'Key Partner' | 'Executive Sponsor' | 'Warm Collaborator' | 'Prospect' | 'In Evaluation';
  lastInteraction: string;
  lastMeetingDate: string;
  totalMeetings: number;
  totalInteractions: number;
  openCommitmentsCount: number;
  tags: string[];
  bio: string;
  communicationStyle: string;
  decisionMakingStyle: string;
  keyProjects: string[];
  keyPriorities: string[];
  knownConcerns: KnownConcern[];
  importantRequirements: ImportantRequirement[];
  interactionTimeline: TimelineItem[];
  meetMindRemembers: RelationshipMemorySummary;
  relationshipMemory?: StructuredRelationshipMemory;
  dataSource?: DataSourceType;
}

export interface MeetingAttendee {
  name: string;
  role: string;
  company: string;
  email: string;
  avatarUrl: string;
  isHost?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  startTime: string; // e.g., "10:00 AM"
  endTime: string;   // e.g., "10:45 AM"
  date: string;      // e.g., "Today", "Tomorrow", "2026-09-30"
  isToday: boolean;
  meetingType: 'Strategic Partnership' | 'Product Deep-dive' | 'Executive Review' | 'Quarterly Sync' | 'Technical Architecture' | 'Contract Renewal';
  location: 'Google Meet' | 'Zoom' | 'In-person' | 'Microsoft Teams';
  purpose: string;
  prepStatus: 'ready' | 'needs_review' | 'in_progress';
  executiveSummary: string;
  keyObjectives: string[];
  talkingPoints: {
    id: string;
    point: string;
    checked: boolean;
    category: 'priority' | 'followup' | 'discovery';
  }[];
  strategicQuestions: string[];
  attendees: MeetingAttendee[];
  dataSource?: DataSourceType;
}

export interface ActivityItem {
  id: string;
  type: 'memory_saved' | 'commitment_completed' | 'meeting_prepared' | 'meeting_logged';
  title: string;
  description: string;
  timestamp: string;
  contactName: string;
  contactCompany: string;
  badgeText?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatarUrl: string;
  subscriptionPlan: string;
  location?: string;
  bio?: string;
}

export type DataSourceType = 'connected' | 'user' | 'sample';

// Hindsight Memory Graph Schema (Architected for upcoming Hindsight SDK integration)
export type HindsightNodeType = 
  | 'previous_meeting'
  | 'decision'
  | 'commitment'
  | 'action_item'
  | 'client_preference'
  | 'open_issue';

export interface HindsightNode {
  id: string;
  type: HindsightNodeType;
  label: string;
  title: string;
  description: string;
  timestamp?: string;
  confidence?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  x?: number;
  y?: number;
}

export interface HindsightEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface HindsightGraphData {
  nodes: HindsightNode[];
  edges: HindsightEdge[];
}

export interface PotentialRiskItem {
  id: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface RecommendedFollowUpItem {
  id: string;
  action: string;
  priority: 'urgent' | 'high' | 'standard';
  owner: string;
}

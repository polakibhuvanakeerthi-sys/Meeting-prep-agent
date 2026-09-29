import { Contact, Meeting, MemoryItem, Commitment, ActivityItem, UserProfile } from '../types';

export const mockCurrentUser: UserProfile = {
  name: 'User',
  email: 'workspace@meetmind.ai',
  role: 'Product Lead',
  company: 'Your Workspace',
  avatarUrl: '',
  subscriptionPlan: 'Professional Plan'
};

export const mockContacts: Contact[] = [
  {
    id: 'contact-rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Product Manager',
    company: 'ABC Technologies',
    email: 'rahul.sharma@abctechnologies.com',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Bangalore, India',
    timezone: 'IST (UTC+5:30)',
    warmthScore: 84,
    relationshipStatus: 'In Evaluation',
    lastInteraction: 'Sep 25, 2026 (Meeting)',
    lastMeetingDate: 'Sep 25, 2026',
    totalMeetings: 4,
    totalInteractions: 11,
    openCommitmentsCount: 2,
    tags: ['Enterprise Deal', 'Q4 Pilot', 'B2B SaaS', 'High Intent'],
    bio: 'Product Manager leading core platform initiatives and internal workflow automation at ABC Technologies. Highly analytical and focused on predictable ROI.',
    communicationStyle: 'Concise and responsive on email. Appreciates structured comparison tables and clear implementation roadmaps.',
    decisionMakingStyle: 'Pragmatic and consensus-oriented. Must align with engineering leadership on security and procurement on licensing costs.',
    keyProjects: ['Enterprise Platform Migration', 'Automated Customer Onboarding Pipeline', 'Vendor Consolidation Q4'],
    keyPriorities: [
      'Fast implementation',
      'Lower initial cost',
      'Reliable deployment'
    ],
    knownConcerns: [
      {
        id: 'concern-1',
        title: 'Pricing & Budget Constraints',
        description: 'Pushed back on enterprise tier pricing in the Sep 25 meeting. Needs a modular starter tier under $35k to avoid CFO escalation.',
        severity: 'high',
        status: 'active'
      },
      {
        id: 'concern-2',
        title: 'Deployment Timeline',
        description: 'Worried that migration may bleed past their Q4 freeze. Requires a guaranteed 3-week onboarding SLA.',
        severity: 'medium',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'req-1',
        title: 'Feature X required',
        deadline: 'Oct 08, 2026',
        status: 'pending',
        impact: 'critical'
      },
      {
        id: 'req-2',
        title: 'Deployment before October 15',
        deadline: 'Oct 15, 2026',
        status: 'pending',
        impact: 'critical'
      },
      {
        id: 'req-3',
        title: 'SOC-2 Type II audit report for compliance committee',
        deadline: 'Oct 02, 2026',
        status: 'satisfied',
        impact: 'preferred'
      }
    ],
    interactionTimeline: [
      {
        id: 'meeting-4',
        date: 'Sep 25',
        type: 'meeting',
        title: 'Meeting 4: The user promised to send a revised proposal',
        summary: 'Met with Rahul and ABC Tech finance team. Discussed pricing limits. The user promised to send a revised proposal with modular starter pricing under $35k ahead of our upcoming sync.',
        highlight: 'User commitment: Send revised proposal under $35k',
        sourceContext: 'Virtual Call via Google Meet (42 mins)'
      },
      {
        id: 'meeting-3',
        date: 'Sep 18',
        type: 'meeting',
        title: 'Meeting 3: Rahul requested Feature X and faster implementation',
        summary: 'Rahul requested Feature X (bidirectional webhook audit trail sync) and faster implementation to beat ABC Technologies internal freeze date.',
        highlight: 'Feature X is mandatory; faster implementation is a priority',
        sourceContext: 'Product Architecture Review (40 mins)'
      },
      {
        id: 'meeting-2',
        date: 'Sep 10',
        type: 'meeting',
        title: 'Meeting 2: Rahul raised concerns about pricing',
        summary: 'Rahul raised concerns about pricing. Stated that standard enterprise tier pricing would trigger a lengthy CFO escalation and delay procurement approval.',
        highlight: 'Pricing was previously a concern',
        sourceContext: 'Virtual Call via Zoom (35 mins)'
      },
      {
        id: 'meeting-1',
        date: 'Aug 28',
        type: 'meeting',
        title: 'Meeting 1: Initial product discussion',
        summary: 'Initial product discussion. Demonstrated MeetMind AI relationship memory capabilities and workflow sync. Evaluated as top vendor among 3 candidates.',
        highlight: 'Strong initial product enthusiasm',
        sourceContext: 'Kickoff Demo Session (50 mins)'
      }
    ],
    meetMindRemembers: {
      summary: 'Rahul is enthusiastic about our core platform capabilities and wants to champion the rollout at ABC Technologies. However, he is caught between engineering’s firm deadline (live before Oct 15 with Feature X) and procurement’s pricing sensitivity. Closing this deal hinges on delivering the revised proposal with modular pricing and confirming the Feature X delivery schedule.',
      keyInsights: [
        'Prefers structured pricing breakdowns over bundled contracts',
        'Engineering freeze begins November 1; October 15 is a hard cutoff',
        'Has two golden retrievers and mentioned family vacation to Goa in December'
      ],
      synthesisMeta: {
        meetingsCount: 4,
        emailsCount: 5,
        notesCount: 2,
        timespan: 'Accumulated over 4 meetings & 7 async touchpoints (32 days)',
        confidenceScore: 0.96,
        lastInteraction: 'Sep 25, 2026'
      }
    }
  },
  {
    id: 'contact-maya-chen',
    name: 'Maya Chen',
    role: 'Head of Developer Ecosystem',
    company: 'Stripe',
    email: 'mchen@stripe.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    warmthScore: 92,
    relationshipStatus: 'Strategic Champion',
    lastInteraction: 'Sep 15, 2026 (Meeting)',
    lastMeetingDate: 'Sep 15, 2026',
    totalMeetings: 8,
    totalInteractions: 24,
    openCommitmentsCount: 2,
    tags: ['Ecosystem', 'Tier 1 Partner', 'Developer Tools', 'Fintech'],
    bio: 'Leads Stripe’s third-party integration marketplace. Previously led developer relations at Twilio. Strong advocate for frictionless developer experiences.',
    communicationStyle: 'Direct, data-driven, prefers concise bullet points and live demos over decks. Responds quickly on Slack Connect.',
    decisionMakingStyle: 'Consensus builder across product & legal teams. Values security audit certifications and clear SLA guarantees above all.',
    keyProjects: ['Global Payouts API v3', 'Partner Marketplace Revamp', 'Real-time Webhook Reliability SLA'],
    keyPriorities: [
      'Sub-50ms p99 global webhook latency',
      'Zero-code merchant activation via Stripe App Marketplace',
      'Co-marketing launch during Stripe Sessions East'
    ],
    knownConcerns: [
      {
        id: 'maya-concern-1',
        title: 'Multi-region failover latency spikes',
        description: 'Worried that European merchants might experience degraded webhook delivery during US-East peak loads.',
        severity: 'high',
        status: 'active'
      },
      {
        id: 'maya-concern-2',
        title: 'Legal indemnification cap',
        description: 'Stripe VP of Legal wants mutual indemnification cap aligned with annual contract value.',
        severity: 'medium',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'maya-req-1',
        title: 'SOC-2 Type II audit certificate renewal',
        deadline: 'Oct 10, 2026',
        status: 'satisfied',
        impact: 'critical'
      },
      {
        id: 'maya-req-2',
        title: 'Sub-50ms p99 benchmark proof',
        deadline: 'Sep 29, 2026',
        status: 'pending',
        impact: 'critical'
      }
    ],
    interactionTimeline: [
      {
        id: 'maya-tl-1',
        date: 'Sep 15',
        type: 'meeting',
        title: 'Commercial terms & revenue share approved',
        summary: 'Agreed on 82/18 rev share in our favor. Maya requested latency telemetry before final signoff.',
        highlight: 'Approved 82/18 rev share model',
        sourceContext: 'Executive Alignment Call'
      },
      {
        id: 'maya-tl-2',
        date: 'Sep 02',
        type: 'meeting',
        title: 'Developer documentation walkthrough',
        summary: 'Reviewed API schemas and onboarding flows with Jordan Keller and Stripe platform architect team.',
        highlight: 'Praised zero-code merchant setup',
        sourceContext: 'Technical Sync'
      },
      {
        id: 'maya-tl-3',
        date: 'Aug 24',
        type: 'email',
        title: 'Boulder half-marathon update & schedule sync',
        summary: 'Maya shared her excitement after finishing Boulder Half-Marathon (1:48:12 PR). Set dates for Q4 roadmap alignment.',
        highlight: 'Personal rapport building',
        sourceContext: 'Email from mchen@stripe.com'
      }
    ],
    meetMindRemembers: {
      summary: 'Maya is our strongest champion at Stripe. She cares intensely about developer ergonomics and SLA guarantees. Never bring a PowerPoint deck to a meeting with her—always open with live metrics or terminal demos. She completed the Boulder Half-Marathon with a PR and loves trail running with her two golden retrievers, Milo and Poppy.',
      keyInsights: [
        'Prefers live demos and API curls over slide decks',
        'Approved 82/18 rev share contingent on sub-50ms p99 latency',
        'Trail runner; ran Boulder Half-Marathon in 1h 48m'
      ],
      synthesisMeta: {
        meetingsCount: 8,
        emailsCount: 12,
        notesCount: 4,
        timespan: 'Accumulated over 8 meetings & 16 async touchpoints (65 days)',
        confidenceScore: 0.98,
        lastInteraction: 'Sep 15, 2026'
      }
    }
  },
  {
    id: 'contact-elena-rostova',
    name: 'Elena Rostova',
    role: 'VP of Engineering',
    company: 'Linear',
    email: 'elena@linear.app',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Reykjavik / Remote',
    timezone: 'GMT (UTC+0)',
    warmthScore: 88,
    relationshipStatus: 'Key Partner',
    lastInteraction: 'Sep 21, 2026 (Meeting)',
    lastMeetingDate: 'Sep 21, 2026',
    totalMeetings: 5,
    totalInteractions: 16,
    openCommitmentsCount: 1,
    tags: ['Productivity', 'Sync Architecture', 'High Warmth', 'Series B+'],
    bio: 'Co-leads core infrastructure and async sync protocols at Linear. Obsessed with sub-50ms UI response times and elegant API design.',
    communicationStyle: 'Async-first. Appreciates written RFCs or Loom walkthroughs before any live call. Values candid technical feedback.',
    decisionMakingStyle: 'Engineering purity meets pragmatic UX. Unforgiving on latency regression.',
    keyProjects: ['Offline-First Sync Engine', 'Enterprise Audit Trail API', 'Granular Permissions Model'],
    keyPriorities: [
      'Sub-50ms sync propagation',
      'Client-side cache consistency',
      'Zero 429 throttling spikes during mass issue imports'
    ],
    knownConcerns: [
      {
        id: 'elena-c1',
        title: 'Cache invalidation loops',
        description: 'Linear’s engineering team will reject connectors that trigger redundant webhook invalidations.',
        severity: 'high',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'elena-r1',
        title: 'OAuth 2.1 scoped tokens',
        deadline: 'Sep 29, 2026',
        status: 'satisfied',
        impact: 'critical'
      }
    ],
    interactionTimeline: [
      {
        id: 'elena-tl-1',
        date: 'Sep 21',
        type: 'meeting',
        title: 'Sync benchmark review',
        summary: 'Evaluated mass import handling. Elena noted 429 rate limit errors on bulk Jira migrations.',
        highlight: 'Requested adaptive backoff schema',
        sourceContext: 'Zoom Call (45 mins)'
      },
      {
        id: 'elena-tl-2',
        date: 'Sep 12',
        type: 'note',
        title: 'Written RFC submitted on GitHub',
        summary: 'Shared technical specification for scoped tokens. Elena reviewed asynchronously with 3 inline approvals.',
        highlight: 'Async review completed',
        sourceContext: 'GitHub RFC #142'
      }
    ],
    meetMindRemembers: {
      summary: 'Elena values extreme engineering precision and async communication. Based in Reykjavik, she loves Scandinavian industrial design and collects custom mechanical keyboards. Keep meetings strictly focused on telemetry benchmarks.',
      keyInsights: [
        'Async-first; prefers written RFCs to video calls',
        'Collects custom mechanical keyboards in Reykjavik',
        'Zero tolerance for UI latency regression'
      ],
      synthesisMeta: {
        meetingsCount: 5,
        emailsCount: 8,
        notesCount: 3,
        timespan: 'Accumulated over 5 meetings & 11 touchpoints (45 days)',
        confidenceScore: 0.95,
        lastInteraction: 'Sep 21, 2026'
      }
    }
  },
  {
    id: 'contact-marcus-vance',
    name: 'Marcus Vance',
    role: 'Director of Cloud Telemetry',
    company: 'Datadog',
    email: 'marcus.vance@datadoghq.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'New York, NY',
    timezone: 'EST (UTC-5)',
    warmthScore: 79,
    relationshipStatus: 'Warm Collaborator',
    lastInteraction: 'Sep 10, 2026 (Meeting)',
    lastMeetingDate: 'Sep 10, 2026',
    totalMeetings: 4,
    totalInteractions: 12,
    openCommitmentsCount: 2,
    tags: ['Observability', 'Enterprise', 'Co-marketing', 'Cloud Scale'],
    bio: 'Oversees open-source integrations and APM agent plugins. Deep background in distributed tracing and eBPF kernel telemetry.',
    communicationStyle: 'Technical, inquisitive, likes whiteboard architecture diagrams and benchmark comparisons.',
    decisionMakingStyle: 'Requires measurable benchmarks and multi-tenant isolation proofs.',
    keyProjects: ['OpenTelemetry GenAI Agent Tracing', 'Cross-Cloud Ingest Optimization'],
    keyPriorities: [
      'Native OpenTelemetry semantic conventions',
      'Joint co-presentation at Datadog DASH 2026',
      'Multi-tenant data isolation'
    ],
    knownConcerns: [
      {
        id: 'marcus-c1',
        title: 'Cognitive agent drift in production',
        description: 'Wants to ensure APM telemetry can differentiate between retrieval latency and model hallucination cycles.',
        severity: 'medium',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'marcus-r1',
        title: 'Draft abstract for Datadog DASH 2026',
        deadline: 'Sep 29, 2026',
        status: 'pending',
        impact: 'critical'
      }
    ],
    interactionTimeline: [
      {
        id: 'marcus-tl-1',
        date: 'Sep 10',
        type: 'meeting',
        title: 'OpenTelemetry specification alignment',
        summary: 'Mapped agent retrieval attributes to Datadog LLM telemetry standards.',
        highlight: 'Aligned on gen_ai.system.retrieval_duration_ms',
        sourceContext: 'Google Meet (30 mins)'
      }
    ],
    meetMindRemembers: {
      summary: 'Marcus is a passionate distributed systems engineer and specialty coffee enthusiast (owns a Decent DE1 espresso machine in Brooklyn). He is our champion for getting our agent telemetry into Datadog’s official partner showcase.',
      keyInsights: [
        'Huge specialty coffee nerd with home roasting setup',
        'Co-authoring Datadog DASH presentation',
        'Focuses on OpenTelemetry semantic compliance'
      ],
      synthesisMeta: {
        meetingsCount: 4,
        emailsCount: 6,
        notesCount: 2,
        timespan: 'Accumulated over 4 meetings & 8 touchpoints (40 days)',
        confidenceScore: 0.94,
        lastInteraction: 'Sep 10, 2026'
      }
    }
  },
  {
    id: 'contact-david-zhao',
    name: 'David Zhao',
    role: 'Head of Enterprise Alliances',
    company: 'Notion',
    email: 'dzhao@makenotion.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Seattle, WA',
    timezone: 'PST (UTC-8)',
    warmthScore: 85,
    relationshipStatus: 'Executive Sponsor',
    lastInteraction: 'Sep 02, 2026 (Meeting)',
    lastMeetingDate: 'Sep 02, 2026',
    totalMeetings: 6,
    totalInteractions: 18,
    openCommitmentsCount: 1,
    tags: ['Workspace', 'AI Integration', 'Q4 Target', 'High Priority'],
    bio: 'Spearheading Notion AI enterprise ecosystem partnerships. Passionate about knowledge graph retrieval and collaborative workflows.',
    communicationStyle: 'Warm, visionary, balances high-level business goals with user empathy. Loves sharing early beta prototypes.',
    decisionMakingStyle: 'Aligns quickly with executive team if user engagement and cross-sell metrics are demonstrably proven.',
    keyProjects: ['Notion AI Workspace Connectors', 'Enterprise Team Spaces Security 2.0'],
    keyPriorities: [
      'Permission inheritance prototype for Notion Teamspaces',
      'Pilot cohort of 10 joint enterprise customers in October',
      'EU data residency compliance'
    ],
    knownConcerns: [
      {
        id: 'david-c1',
        title: 'Redundant embedding generation',
        description: 'Concerned about cost spikes if workspace updates trigger duplicate embedding runs.',
        severity: 'high',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'david-r1',
        title: '10 enterprise pilot accounts list',
        deadline: 'Sep 30, 2026',
        status: 'pending',
        impact: 'preferred'
      }
    ],
    interactionTimeline: [
      {
        id: 'david-tl-1',
        date: 'Sep 02',
        type: 'meeting',
        title: 'Notion AI strategy session',
        summary: 'Discussed bidirectional connector prototype. David emphasized that apps writing structured data back to Notion receive spotlight placement.',
        highlight: 'Prioritizing native AI agents over simple chatbots',
        sourceContext: 'Microsoft Teams (45 mins)'
      }
    ],
    meetMindRemembers: {
      summary: 'David wants Notion to be the ultimate central repository of business intelligence. Lives in Bellevue and coaches his son’s Little League team. He will sponsor our integration if we show bidirectional sync without permission leaks.',
      keyInsights: [
        'Coaches son’s Little League baseball in Bellevue',
        'Prioritizes database writeback over chat bots',
        'Sponsoring October pilot with 10 joint enterprise customers'
      ],
      synthesisMeta: {
        meetingsCount: 6,
        emailsCount: 9,
        notesCount: 3,
        timespan: 'Accumulated over 6 meetings & 12 touchpoints (50 days)',
        confidenceScore: 0.95,
        lastInteraction: 'Sep 02, 2026'
      }
    }
  },
  {
    id: 'contact-sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Chief Revenue Officer',
    company: 'Ramp',
    email: 'sjenkins@ramp.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    location: 'Austin, TX',
    timezone: 'CST (UTC-6)',
    warmthScore: 74,
    relationshipStatus: 'Prospect',
    lastInteraction: 'Aug 28, 2026 (Meeting)',
    lastMeetingDate: 'Aug 28, 2026',
    totalMeetings: 3,
    totalInteractions: 9,
    openCommitmentsCount: 1,
    tags: ['Fintech', 'Procurement', 'Annual Contract', 'Pipeline'],
    bio: 'Drives commercial strategy and strategic customer expansion for Ramp. Laser-focused on corporate expense automation ROI.',
    communicationStyle: 'Executive, results-oriented, values bottom-line ROI metrics and rapid implementation timelines.',
    decisionMakingStyle: 'ROI-driven, fast decision cycles when business case shows >4x cost savings within 6 months.',
    keyProjects: ['Procurement Automation 3.0', 'Automated Travel Expense Concierge'],
    keyPriorities: [
      '15% reduction in meeting prep overhead',
      '250-seat rollout across enterprise relationship managers',
      'Payback period under 6 months'
    ],
    knownConcerns: [
      {
        id: 'sarah-c1',
        title: 'Sales rep adoption friction',
        description: 'Worries that reps won’t read prep dossiers if they take longer than 45 seconds to digest.',
        severity: 'high',
        status: 'active'
      }
    ],
    importantRequirements: [
      {
        id: 'sarah-r1',
        title: 'SOC-2 Type II audit package for security committee',
        deadline: 'Oct 01, 2026',
        status: 'pending',
        impact: 'critical'
      }
    ],
    interactionTimeline: [
      {
        id: 'sarah-tl-1',
        date: 'Aug 28',
        type: 'meeting',
        title: 'Procurement demo & ROI review',
        summary: 'Presented 3-tier enterprise rollout. Sarah asked for exact formula quantifying hours saved per rep.',
        highlight: 'Requested tailored 250-seat pricing model',
        sourceContext: 'Zoom Call (35 mins)'
      }
    ],
    meetMindRemembers: {
      summary: 'Sarah is an executive buyer focused exclusively on measurable efficiency metrics. Mutual friend Derek Martinez speaks highly of her. If we provide clear proof of 15% meeting prep time savings, Ramp’s finance committee will execute the contract by October 15.',
      keyInsights: [
        'Always include explicit formula for hours saved per employee',
        'Connected through mutual friend Derek Martinez',
        'Decision driven by 4x ROI hurdle rate'
      ],
      synthesisMeta: {
        meetingsCount: 3,
        emailsCount: 5,
        notesCount: 1,
        timespan: 'Accumulated over 3 meetings & 6 touchpoints (30 days)',
        confidenceScore: 0.93,
        lastInteraction: 'Aug 28, 2026'
      }
    }
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-rahul-upcoming',
    title: 'Discuss revised proposal',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    company: 'ABC Technologies',
    startTime: '2:00 PM',
    endTime: '2:45 PM',
    date: 'Today',
    isToday: true,
    meetingType: 'Contract Renewal',
    location: 'Google Meet',
    purpose: 'Address pricing feedback from Sep 25, present the modular $34k starter tier, and confirm Feature X release schedule ahead of their Oct 15 deployment deadline.',
    prepStatus: 'ready',
    executiveSummary: 'Rahul wants to buy, but is boxed in by budget and engineering timing. Today’s goal is to close the deal by walking through the restructured modular tier under $35k and locking in the Oct 8 delivery date for Feature X so ABC Tech can complete deployment before their Nov 1 freeze.',
    keyObjectives: [
      'Present revised modular proposal: $34k starter tier for 30 seats (mitigates their budget concern).',
      'Provide engineering signoff on Feature X delivery by October 8.',
      'Confirm deployment kickoff on October 10 to ensure completion before October 15.',
      'Obtain verbal go-ahead to issue final order form for legal review.'
    ],
    talkingPoints: [
      {
        id: 'tp-rahul-1',
        point: 'Acknowledge Rahul’s budget guidance from our call on Sep 25: walk through the revised modular quote',
        checked: false,
        category: 'priority'
      },
      {
        id: 'tp-rahul-2',
        point: 'Show Feature X technical roadmap: audit trail webhook dispatcher is already in staging, ready Oct 8',
        checked: false,
        category: 'priority'
      },
      {
        id: 'tp-rahul-3',
        point: 'Review implementation calendar: 5 business days onboarding with dedicated Solutions Architect',
        checked: false,
        category: 'priority'
      },
      {
        id: 'tp-rahul-4',
        point: 'Check in casually on how his golden retrievers are doing in Bangalore',
        checked: false,
        category: 'discovery'
      }
    ],
    strategicQuestions: [
      '“Rahul, if we confirm Feature X for Oct 8 and lock in the $34k package, does that clear the path for procurement approval this week?”',
      '“Who from your InfoSec team will sign off on the SOC-2 audit packet we sent over?”'
    ],
    attendees: [
      {
        name: 'Rahul Sharma',
        role: 'Product Manager',
        company: 'ABC Technologies',
        email: 'rahul.sharma@abctechnologies.com',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80'
      },
      {
        name: 'Alex Rivera',
        role: 'VP of Product',
        company: 'MeetMind AI',
        email: 'alex.rivera@meetmind.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        isHost: true
      }
    ]
  },
  {
    id: 'meeting-maya-today',
    title: 'Stripe Connect Ecosystem Q4 Roadmap & SLA Review',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    company: 'Stripe',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    date: 'Today',
    isToday: true,
    meetingType: 'Strategic Partnership',
    location: 'Google Meet',
    purpose: 'Finalize terms for co-marketing launch in November, review SOC-2 Type II audit report deliverables, and address latency questions on webhook dispatching.',
    prepStatus: 'ready',
    executiveSummary: 'Maya is Stripe’s champion for our joint partner connector. Today is the go/no-go alignment for the November global launch. Stripe leadership wants reassurance on multi-region failover and confirmation that our pricing model does not create friction for mid-market merchants.',
    keyObjectives: [
      'Confirm launch date for November 12 during Stripe Sessions East.',
      'Deliver the multi-region failover benchmark Maya requested last meeting.',
      'Check in on their VP of Legal review regarding the mutual indemnification clause.',
      'Secure Maya’s commitment to co-author the official launch blog post.'
    ],
    talkingPoints: [
      {
        id: 'tp-1',
        point: 'Congratulate Maya on completing the Boulder Half-Marathon (she set a PR of 1h 48m two weekends ago!)',
        checked: false,
        category: 'discovery'
      },
      {
        id: 'tp-2',
        point: 'Review latency benchmarks: 38ms p99 across 5 global AWS/GCP edge nodes, well within Stripe’s 50ms requirement',
        checked: false,
        category: 'priority'
      },
      {
        id: 'tp-3',
        point: 'Clarify merchant onboarding flow: zero-code activation via Stripe App Marketplace',
        checked: false,
        category: 'priority'
      },
      {
        id: 'tp-4',
        point: 'Check status of Legal review: mutual IP protections and indemnification cap',
        checked: false,
        category: 'followup'
      }
    ],
    strategicQuestions: [
      '“Maya, how did the internal review with Patrick’s team go regarding the revenue share tiering?”',
      '“Are there any remaining blocker items for your security team before signing the mutual DPA?”'
    ],
    attendees: [
      {
        name: 'Maya Chen',
        role: 'Head of Developer Ecosystem',
        company: 'Stripe',
        email: 'mchen@stripe.com',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80'
      },
      {
        name: 'Jordan Keller',
        role: 'Staff Solutions Architect',
        company: 'Stripe',
        email: 'jkeller@stripe.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80'
      },
      {
        name: 'Alex Rivera',
        role: 'VP of Product',
        company: 'MeetMind AI',
        email: 'alex.rivera@meetmind.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        isHost: true
      }
    ]
  },
  {
    id: 'meeting-elena-today',
    title: 'Linear Sync Architecture & Enterprise Webhooks Deep-dive',
    contactId: 'contact-elena-rostova',
    contactName: 'Elena Rostova',
    company: 'Linear',
    startTime: '2:00 PM',
    endTime: '2:45 PM',
    date: 'Today',
    isToday: true,
    meetingType: 'Technical Architecture',
    location: 'Zoom',
    purpose: 'Review the high-throughput bidirectional sync engine. Linear team has concerns regarding rate-limiting spikes during mass issue imports.',
    prepStatus: 'ready',
    executiveSummary: 'Elena values extreme engineering precision. Last call, she flagged that bulk Jira migrations caused 429 rate limit errors. We have prepared an adaptive batching architecture with exponential backoff and jitter to demonstrate resolution.',
    keyObjectives: [
      'Demo the new adaptive bulk synchronization queue.',
      'Show test telemetry proving 0 dropped events during a simulated 50,000 issue sync.',
      'Obtain approval for our enterprise integration sandbox access.'
    ],
    talkingPoints: [
      {
        id: 'tp-linear-1',
        point: 'Ask how the Linear Reykjavik team retreat went last week',
        checked: false,
        category: 'discovery'
      },
      {
        id: 'tp-linear-2',
        point: 'Show live benchmark: 4,200 issues/sec ingested with zero 429 throttling errors',
        checked: false,
        category: 'priority'
      }
    ],
    strategicQuestions: [
      '“Elena, how does your team plan to handle tenant-level rate limit exceptions for Enterprise Grid customers?”'
    ],
    attendees: [
      {
        name: 'Elena Rostova',
        role: 'VP of Engineering',
        company: 'Linear',
        email: 'elena@linear.app',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80'
      }
    ]
  },
  {
    id: 'meeting-marcus-today',
    title: 'Datadog Partner Marketplace Integration Sync',
    contactId: 'contact-marcus-vance',
    contactName: 'Marcus Vance',
    company: 'Datadog',
    startTime: '4:30 PM',
    endTime: '5:00 PM',
    date: 'Today',
    isToday: true,
    meetingType: 'Product Deep-dive',
    location: 'Google Meet',
    purpose: 'Align on OpenTelemetry collector metrics schema and discuss Datadog DASH 2026 conference booth co-sponsorship.',
    prepStatus: 'ready',
    executiveSummary: 'Marcus is driving Datadog’s AI agent observability standards. We need to align on semantic conventions for LLM token tracing so our metrics integrate natively into Datadog LLM Observability dashboards.',
    keyObjectives: [
      'Confirm alignment on OpenTelemetry semantic conventions for AI agent memory retrieval latency.',
      'Lock in co-speaker submission for Datadog DASH.'
    ],
    talkingPoints: [
      {
        id: 'tp-dd-1',
        point: 'Ask Marcus about his new pour-over espresso setup he was excited to receive',
        checked: false,
        category: 'discovery'
      }
    ],
    strategicQuestions: [
      '“Marcus, how are enterprise Datadog customers currently tracking cognitive agent drift in production?”'
    ],
    attendees: [
      {
        name: 'Marcus Vance',
        role: 'Director of Cloud Telemetry',
        company: 'Datadog',
        email: 'marcus.vance@datadoghq.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80'
      }
    ]
  }
];

export const mockMemories: MemoryItem[] = [
  {
    id: 'mem-rahul-1',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    category: 'preference',
    content: 'Very sensitive to enterprise tier pricing. Needs a modular starter tier under $35k to avoid CFO committee escalation.',
    sourceMeetingTitle: 'Pricing Discussion (Sep 25)',
    dateAdded: 'Sep 25, 2026',
    confidenceScore: 0.98,
    tags: ['Pricing', 'Budget', 'Procurement', 'Modular'],
    pinned: true
  },
  {
    id: 'mem-rahul-2',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    category: 'decision',
    content: 'Confirmed that Feature X (bidirectional webhook sync with audit trail) is mandatory for sign-off.',
    sourceMeetingTitle: 'Architecture Requirements Sync',
    dateAdded: 'Sep 18, 2026',
    confidenceScore: 0.99,
    tags: ['Feature X', 'Mandatory', 'Audit Trail', 'Security'],
    pinned: true
  },
  {
    id: 'mem-rahul-3',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    category: 'strategic',
    content: 'Engineering freeze starts November 1. Full deployment must be completed before October 15.',
    sourceMeetingTitle: 'Implementation Timeline Review',
    dateAdded: 'Sep 10, 2026',
    confidenceScore: 0.97,
    tags: ['Timeline', 'Cutoff', 'Go-Live', 'Freeze'],
    pinned: true
  },
  {
    id: 'mem-rahul-4',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    category: 'personal',
    content: 'Has two golden retrievers in Bangalore. Mentioned taking his family on vacation to Goa in early December.',
    sourceMeetingTitle: 'Kickoff Discovery Session',
    dateAdded: 'Aug 28, 2026',
    confidenceScore: 0.95,
    tags: ['Personal', 'Pets', 'Family', 'Travel']
  },
  {
    id: 'mem-maya-1',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    contactCompany: 'Stripe',
    category: 'personal',
    content: 'Trained for the Boulder Half-Marathon over the summer and ran a personal record of 1:48:12. Loves trail running with her two golden retrievers, Milo and Poppy.',
    sourceMeetingTitle: 'Stripe Connect Partner Sync (Aug 24)',
    dateAdded: 'Aug 24, 2026',
    confidenceScore: 0.99,
    tags: ['Personal', 'Running', 'Pets', 'Family'],
    pinned: true
  },
  {
    id: 'mem-maya-2',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    contactCompany: 'Stripe',
    category: 'preference',
    content: 'Dislikes long slide presentations. Prefers 5-minute concise executive context followed by live demos or hands-on API curl walkthroughs.',
    sourceMeetingTitle: 'Stripe Partner Architecture Review',
    dateAdded: 'Sep 02, 2026',
    confidenceScore: 0.96,
    tags: ['Meeting Style', 'Deck Free', 'Live Demos'],
    pinned: true
  },
  {
    id: 'mem-maya-3',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    contactCompany: 'Stripe',
    category: 'decision',
    content: 'Stripe leadership approved the revenue share model at 82/18 in our favor for self-serve signups, contingent upon meeting the sub-50ms p99 latency SLA.',
    sourceMeetingTitle: 'Commercial Terms Strategy Call',
    dateAdded: 'Sep 15, 2026',
    confidenceScore: 0.98,
    tags: ['Pricing', 'Rev Share', 'Contract Milestone']
  },
  {
    id: 'mem-elena-1',
    contactId: 'contact-elena-rostova',
    contactName: 'Elena Rostova',
    contactCompany: 'Linear',
    category: 'personal',
    content: 'Based primarily in Reykjavik. Passionate about minimalist Scandinavian industrial design and collects mechanical keyboards with custom silent tactile switches.',
    sourceMeetingTitle: 'Linear Integration Kickoff',
    dateAdded: 'Sep 08, 2026',
    confidenceScore: 0.95,
    tags: ['Personal', 'Reykjavik', 'Hardware', 'Design'],
    pinned: true
  },
  {
    id: 'mem-marcus-1',
    contactId: 'contact-marcus-vance',
    contactName: 'Marcus Vance',
    contactCompany: 'Datadog',
    category: 'personal',
    content: 'Huge specialty coffee nerd. Recently acquired a Decent DE1 espresso machine and roasts Ethiopian single-origin beans at home in Brooklyn.',
    sourceMeetingTitle: 'Telemetry Alliances Sync',
    dateAdded: 'Aug 19, 2026',
    confidenceScore: 0.98,
    tags: ['Personal', 'Coffee', 'Brooklyn'],
    pinned: true
  }
];

export const mockCommitments: Commitment[] = [
  {
    id: 'com-rahul-1',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    meetingId: 'meeting-rahul-upcoming',
    meetingTitle: 'ABC Technologies: Revised Proposal & Feature X Delivery Review',
    type: 'you_owe_them',
    description: 'Send revised proposal with modular starter tier under $35k addressing ABC Tech budget limits.',
    dueDate: 'Today, 11:30 AM',
    status: 'pending',
    createdAt: 'Sep 25, 2026'
  },
  {
    id: 'com-rahul-2',
    contactId: 'contact-rahul-sharma',
    contactName: 'Rahul Sharma',
    meetingId: 'meeting-rahul-upcoming',
    meetingTitle: 'ABC Technologies: Revised Proposal & Feature X Delivery Review',
    type: 'you_owe_them',
    description: 'Share detailed implementation timeline confirming October 15 go-live date with solutions engineering team.',
    dueDate: 'Today, 11:30 AM',
    status: 'pending',
    createdAt: 'Sep 25, 2026'
  },
  {
    id: 'com-1',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    meetingId: 'meeting-maya-today',
    meetingTitle: 'Stripe Connect Ecosystem Q4 Roadmap',
    type: 'you_owe_them',
    description: 'Provide updated multi-region benchmark report showing sub-50ms p99 latency for webhook dispatching across EU and US-East regions.',
    dueDate: 'Today, 10:30 AM',
    status: 'pending',
    createdAt: 'Sep 15, 2026'
  },
  {
    id: 'com-2',
    contactId: 'contact-maya-chen',
    contactName: 'Maya Chen',
    meetingId: 'meeting-maya-today',
    meetingTitle: 'Stripe Connect Ecosystem Q4 Roadmap',
    type: 'they_owe_you',
    description: 'Maya to follow up with Stripe VP of Legal regarding mutual indemnification clause in the developer partner agreement.',
    dueDate: 'Today, 10:30 AM',
    status: 'pending',
    createdAt: 'Sep 15, 2026'
  },
  {
    id: 'com-3',
    contactId: 'contact-elena-rostova',
    contactName: 'Elena Rostova',
    meetingId: 'meeting-elena-today',
    meetingTitle: 'Linear Sync Architecture & Enterprise Webhooks Deep-dive',
    type: 'you_owe_them',
    description: 'Send OAuth 2.1 scoped token schema and proof-of-concept repository link before today’s architecture call.',
    dueDate: 'Today, 1:00 PM',
    status: 'completed',
    createdAt: 'Sep 21, 2026'
  }
];

export const mockRecentActivity: ActivityItem[] = [
  {
    id: 'act-0',
    type: 'memory_saved',
    title: 'Relationship Fact Extracted',
    description: 'Captured note for Rahul Sharma: "Prefers modular pricing under $35k; hard engineering freeze starts Nov 1."',
    timestamp: '12 minutes ago',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    badgeText: 'Budget Constraint'
  },
  {
    id: 'act-1',
    type: 'meeting_prepared',
    title: 'Executive Briefing Generated',
    description: 'AI synthesized 4 prior meetings, 5 emails, and 2 notes for upcoming sync with Rahul Sharma.',
    timestamp: '25 minutes ago',
    contactName: 'Rahul Sharma',
    contactCompany: 'ABC Technologies',
    badgeText: 'Prep Ready'
  },
  {
    id: 'act-2',
    type: 'meeting_prepared',
    title: 'Executive Briefing Generated',
    description: 'AI synthesized 8 prior meetings and 4 relationship memory points for upcoming sync with Maya Chen.',
    timestamp: '45 minutes ago',
    contactName: 'Maya Chen',
    contactCompany: 'Stripe',
    badgeText: 'Prep Ready'
  },
  {
    id: 'act-3',
    type: 'commitment_completed',
    title: 'Commitment Marked Complete',
    description: 'Delivered OAuth 2.1 scoped token schema and repo link to Elena Rostova ahead of schedule.',
    timestamp: '1 hour ago',
    contactName: 'Elena Rostova',
    contactCompany: 'Linear',
    badgeText: 'Delivered'
  }
];

export const sampleContacts: Contact[] = mockContacts.map((c) => ({
  ...c,
  dataSource: 'sample' as const
}));

export const sampleMeetings: Meeting[] = mockMeetings.map((m) => ({
  ...m,
  dataSource: 'sample' as const
}));

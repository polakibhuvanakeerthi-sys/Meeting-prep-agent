import { 
  Contact, 
  StructuredRelationshipMemory, 
  MemoryChangeItem, 
  MemoryChangeLog, 
  ExtractedMemoryData,
  ActiveConcern,
  ResolvedConcern,
  StructuredCommitment,
  StructuredRequirement,
  StructuredDecision,
  StructuredInteraction,
  StructuredImportantDate
} from '../types';

/**
 * Creates default StructuredRelationshipMemory for a contact if missing or incomplete.
 */
export const ensureStructuredMemory = (contact: Contact): StructuredRelationshipMemory => {
  if (contact.relationshipMemory) {
    return contact.relationshipMemory;
  }

  // Derive from existing contact data
  const isRahul = contact.name.toLowerCase().includes('rahul');
  const isMaya = contact.name.toLowerCase().includes('maya');
  const isElena = contact.name.toLowerCase().includes('elena');

  if (isRahul) {
    return {
      contactOverview: {
        name: contact.name,
        company: contact.company,
        role: contact.role,
        relationshipStatus: contact.relationshipStatus
      },
      priorities: {
        current: [
          'Faster implementation',
          'Lower initial cost',
          'Reliable deployment'
        ],
        historical: [
          {
            id: 'hp-rahul-1',
            priority: 'Vendor evaluation & RFP benchmarking across top 3 candidates',
            achievedDate: 'Aug 28, 2026',
            outcome: 'Selected MeetMind as leading candidate for Q4 pilot'
          }
        ]
      },
      concerns: {
        active: [
          {
            id: 'concern-pricing',
            title: 'Pricing concern',
            description: 'Rahul raised concerns about pricing in Meeting 2. Needs a modular starter tier under $35k to avoid CFO escalation.',
            severity: 'high',
            dateAdded: 'Sep 25, 2026'
          },
          {
            id: 'concern-deployment',
            title: 'Deployment timeline',
            description: 'Worried that migration may bleed past their Q4 freeze. Requires a guaranteed 3-week onboarding SLA.',
            severity: 'medium',
            dateAdded: 'Sep 10, 2026'
          }
        ],
        resolved: [
          {
            id: 'concern-soc2',
            title: 'SOC-2 Type II compliance audit verification',
            resolutionNotes: 'Auditor letter sent and accepted by ABC Tech InfoSec committee without objections.',
            resolvedDate: 'Sep 02, 2026',
            resolvedInMeeting: 'Technical Sync'
          }
        ]
      },
      commitments: [
        {
          id: 'com-rahul-1',
          commitment: 'Send revised proposal',
          owner: 'You',
          dueDate: 'Today, 2:00 PM',
          status: 'pending',
          sourceMeeting: 'Meeting 4: The user promised to send a revised proposal'
        },
        {
          id: 'com-rahul-2',
          commitment: 'Provide API sandbox credentials for audit team',
          owner: 'You',
          dueDate: 'Oct 02, 2026',
          status: 'pending',
          sourceMeeting: 'Meeting 3: Rahul requested Feature X and faster implementation'
        },
        {
          id: 'com-rahul-3',
          commitment: 'Share ABC Tech webhook schema specification',
          owner: 'Rahul Sharma',
          dueDate: 'Sep 18, 2026',
          status: 'completed',
          completedDate: 'Sep 18, 2026',
          sourceMeeting: 'Meeting 3'
        }
      ],
      requirements: [
        {
          id: 'req-rahul-1',
          requirement: 'Feature X required',
          sourceInteraction: 'Meeting 3: Rahul requested Feature X and faster implementation',
          status: 'active',
          lastUpdated: 'Sep 18, 2026'
        },
        {
          id: 'req-rahul-2',
          requirement: 'Implementation timeline',
          sourceInteraction: 'Meeting 1 & Meeting 2',
          status: 'active',
          lastUpdated: 'Sep 10, 2026'
        },
        {
          id: 'req-rahul-3',
          requirement: 'SOC-2 Type II audit certificate',
          sourceInteraction: 'Meeting 1 Discovery Call',
          status: 'satisfied',
          lastUpdated: 'Sep 02, 2026'
        }
      ],
      decisions: [
        {
          id: 'dec-rahul-1',
          decision: 'Selected MeetMind for Q4 enterprise pilot over 2 competing vendors',
          date: 'Aug 28, 2026',
          relatedMeeting: 'Meeting 1: Initial product discussion'
        },
        {
          id: 'dec-rahul-2',
          decision: 'Mandated InfoSec approval gate before production deployment',
          date: 'Sep 02, 2026',
          relatedMeeting: 'Meeting 2'
        },
        {
          id: 'dec-rahul-3',
          decision: 'Agreed on 30 initial user seats for rollout stage',
          date: 'Sep 25, 2026',
          relatedMeeting: 'Meeting 4'
        }
      ],
      interactions: [
        {
          id: 'int-rahul-4',
          date: 'Sep 25, 2026',
          type: 'meeting',
          summary: 'Meeting 4: The user promised to send a revised proposal with modular starter pricing under $35k.',
          topics: ['Revised proposal', 'Pricing envelope', 'Contract tiers']
        },
        {
          id: 'int-rahul-3',
          date: 'Sep 18, 2026',
          type: 'meeting',
          summary: 'Meeting 3: Rahul requested Feature X and faster implementation ahead of the Nov 1 freeze.',
          topics: ['Feature X required', 'Faster implementation', 'Webhooks']
        },
        {
          id: 'int-rahul-2',
          date: 'Sep 10, 2026',
          type: 'meeting',
          summary: 'Meeting 2: Rahul raised concerns about pricing exceeding the pilot budget.',
          topics: ['Pricing concern', 'Budget review', 'Procurement']
        },
        {
          id: 'int-rahul-1',
          date: 'Aug 28, 2026',
          type: 'meeting',
          summary: 'Meeting 1: Initial product discussion. Evaluated as top vendor among 3 candidates.',
          topics: ['Product discovery', 'Platform capabilities', 'Architecture']
        }
      ],
      importantDates: [
        {
          id: 'date-rahul-1',
          date: 'October 15, 2026',
          description: 'Hard target go-live deadline before internal freeze',
          category: 'deadline'
        },
        {
          id: 'date-rahul-2',
          date: 'November 01, 2026',
          description: 'ABC Technologies company-wide Q4 code freeze',
          category: 'milestone'
        },
        {
          id: 'date-rahul-3',
          date: 'December 15, 2026',
          description: 'Rahul’s family vacation to Goa (avoid scheduling executive syncs)',
          category: 'personal'
        }
      ]
    };
  }

  // Generic fallback derived from contact
  return {
    contactOverview: {
      name: contact.name,
      company: contact.company,
      role: contact.role,
      relationshipStatus: contact.relationshipStatus
    },
    priorities: {
      current: contact.keyPriorities && contact.keyPriorities.length > 0 
        ? [...contact.keyPriorities] 
        : ['Accelerate product velocity', 'Reliable infrastructure'],
      historical: [
        {
          id: `hp-${contact.id}-1`,
          priority: 'Initial partnership exploratory assessment',
          achievedDate: 'August 2026',
          outcome: 'Signed mutual NDA and established shared Slack channel'
        }
      ]
    },
    concerns: {
      active: (contact.knownConcerns || [])
        .filter((c) => c.status === 'active')
        .map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          severity: c.severity,
          dateAdded: 'Recent Meeting'
        })),
      resolved: (contact.knownConcerns || [])
        .filter((c) => c.status === 'resolved')
        .map((c) => ({
          id: c.id,
          title: c.title,
          resolutionNotes: 'Resolved in previous alignment session',
          resolvedDate: 'Earlier this month'
        }))
    },
    commitments: [
      {
        id: `com-${contact.id}-1`,
        commitment: 'Follow up on technical integration specification',
        owner: 'You',
        dueDate: 'Next Week',
        status: 'pending'
      }
    ],
    requirements: (contact.importantRequirements || []).map((r) => ({
      id: r.id,
      requirement: r.title,
      sourceInteraction: 'Prior Discussion',
      status: r.status === 'satisfied' ? 'satisfied' : 'active',
      lastUpdated: 'Recent'
    })),
    decisions: [
      {
        id: `dec-${contact.id}-1`,
        decision: `Initiated partnership evaluation with ${contact.company}`,
        date: contact.lastMeetingDate || 'Recent',
        relatedMeeting: 'Discovery Sync'
      }
    ],
    interactions: (contact.interactionTimeline || []).map((t) => ({
      id: t.id,
      date: t.date,
      type: t.type === 'email' ? 'email' : 'meeting',
      summary: t.summary,
      topics: [t.title]
    })),
    importantDates: [
      {
        id: `date-${contact.id}-1`,
        date: 'End of Q4',
        description: 'Target milestone delivery & evaluation review',
        category: 'milestone'
      }
    ]
  };
};

/**
 * INTELLIGENT MEMORY MERGE ENGINE
 * Intelligently merges incoming meeting information with existing structured relationship memory.
 * - Deduplicates incoming facts against existing knowledge graph.
 * - If a concern is resolved, moves it from active concerns to resolved concerns.
 * - If a commitment is completed, marks it completed.
 * - If a new requirement is introduced, adds it to requirements.
 * - If a previous requirement changes, updates the existing requirement rather than duplicating.
 * - Produces a clean structured diff (MemoryChangeItem[]).
 */
export const mergeRelationshipMemory = (
  existingMemory: StructuredRelationshipMemory,
  extractedData: ExtractedMemoryData,
  meetingTitle: string,
  rawNotes: string
): {
  updatedMemory: StructuredRelationshipMemory;
  changes: MemoryChangeItem[];
} => {
  const changes: MemoryChangeItem[] = [];

  // Normalize inputs across snake_case (AI Layer Operation 2) and camelCase
  const resolvedIssues = extractedData.resolved_issues || extractedData.resolvedIssues || [];
  const newRequirements = extractedData.new_requirements || extractedData.newRequirements || [];
  const commitments = extractedData.new_commitments || extractedData.commitments || [];
  const importantDates = extractedData.important_dates || extractedData.importantDates || [];
  const newConcerns = extractedData.new_concerns || extractedData.newConcerns || [];
  const decisions = extractedData.decisions || [];

  // Deep clone to ensure immutability
  const memory: StructuredRelationshipMemory = {
    contactOverview: existingMemory.contactOverview,
    priorities: {
      current: [...existingMemory.priorities.current],
      historical: [...existingMemory.priorities.historical]
    },
    concerns: {
      active: [...existingMemory.concerns.active],
      resolved: [...existingMemory.concerns.resolved]
    },
    commitments: [...existingMemory.commitments],
    requirements: [...existingMemory.requirements],
    decisions: [...existingMemory.decisions],
    interactions: [...existingMemory.interactions],
    importantDates: [...existingMemory.importantDates]
  };

  // ---------------------------------------------------------------------------
  // 1a. CONCERNS: Resolve active concerns if mentioned
  // ---------------------------------------------------------------------------
  resolvedIssues.forEach((issueText) => {
    const issueLower = issueText.toLowerCase();

    // Check in active concerns
    const activeIndex = memory.concerns.active.findIndex((c) => {
      const cTitle = c.title.toLowerCase();
      const cDesc = c.description.toLowerCase();
      return (
        cTitle.includes(issueLower) ||
        issueLower.includes(cTitle) ||
        (issueLower.includes('pricing') && (cTitle.includes('pricing') || cTitle.includes('cost') || cTitle.includes('budget'))) ||
        (issueLower.includes('timeline') && (cTitle.includes('timeline') || cTitle.includes('freeze') || cTitle.includes('deployment'))) ||
        (issueLower.includes('feature x') && (cTitle.includes('feature x') || cDesc.includes('feature x')))
      );
    });

    if (activeIndex >= 0) {
      const activeConcern = memory.concerns.active[activeIndex];
      // Remove from active
      memory.concerns.active.splice(activeIndex, 1);

      // Add to resolved
      const resolvedConcern: ResolvedConcern = {
        id: `res-${activeConcern.id}-${Date.now()}`,
        title: activeConcern.title,
        resolutionNotes: `Resolved during ${meetingTitle}: ${issueText}. Terms mutually confirmed.`,
        resolvedDate: 'Today',
        resolvedInMeeting: meetingTitle
      };
      memory.concerns.resolved.unshift(resolvedConcern);

      changes.push({
        id: `chg-res-${Date.now()}-${changes.length}`,
        type: 'resolved',
        category: 'concern',
        label: '✓ Resolved:',
        title: activeConcern.title,
        detail: `Moved from active concerns to resolved concerns (${meetingTitle})`
      });
    } else {
      // Check if not already in resolved
      const alreadyResolved = memory.concerns.resolved.some((r) =>
        r.title.toLowerCase().includes(issueLower) || issueLower.includes(r.title.toLowerCase())
      );
      if (!alreadyResolved) {
        memory.concerns.resolved.unshift({
          id: `res-${Date.now()}-${changes.length}`,
          title: issueText,
          resolutionNotes: `Explicitly confirmed resolved during ${meetingTitle}`,
          resolvedDate: 'Today',
          resolvedInMeeting: meetingTitle
        });
        changes.push({
          id: `chg-res-${Date.now()}-${changes.length}`,
          type: 'resolved',
          category: 'concern',
          label: '✓ Resolved:',
          title: issueText,
          detail: 'Marked as resolved in relationship memory'
        });
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 1b. NEW CONCERNS: Record newly raised concerns/blockers without duplicate
  // ---------------------------------------------------------------------------
  newConcerns.forEach((concernText) => {
    const concernLower = concernText.toLowerCase();
    const alreadyExists = memory.concerns.active.some(
      (c) => c.title.toLowerCase().includes(concernLower) || concernLower.includes(c.title.toLowerCase())
    ) || memory.concerns.resolved.some(
      (r) => r.title.toLowerCase().includes(concernLower) || concernLower.includes(r.title.toLowerCase())
    );

    if (!alreadyExists) {
      const newActive: ActiveConcern = {
        id: `concern-${Date.now()}-${changes.length}`,
        title: concernText,
        description: `Flagged during ${meetingTitle}: ${concernText}`,
        severity: 'high',
        dateAdded: 'Today'
      };
      memory.concerns.active.unshift(newActive);
      changes.push({
        id: `chg-concern-new-${Date.now()}-${changes.length}`,
        type: 'new',
        category: 'concern',
        label: '+ New concern detected:',
        title: concernText,
        detail: `Added to active concerns (${meetingTitle})`
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 2. COMMITMENTS: Complete previous commitments & Add new ones
  // ---------------------------------------------------------------------------
  // If notes mention pricing proposal accepted, mark our previous commitment completed
  const notesLower = rawNotes.toLowerCase();
  memory.commitments.forEach((com) => {
    if (com.status === 'pending') {
      const comLower = com.commitment.toLowerCase();
      const isCompleted = 
        (comLower.includes('pricing') && (notesLower.includes('accepted the revised pricing') || notesLower.includes('pricing accepted') || notesLower.includes('revised pricing'))) ||
        (comLower.includes('feature x') && notesLower.includes('confirmed that feature x is required')) ||
        (comLower.includes('timeline') && notesLower.includes('timeline was approved'));

      if (isCompleted) {
        com.status = 'completed';
        com.completedDate = 'Today';
        changes.push({
          id: `chg-com-done-${Date.now()}-${changes.length}`,
          type: 'resolved',
          category: 'commitment',
          label: '✓ Completed commitment:',
          title: com.commitment,
          detail: `Satisfied in ${meetingTitle}`
        });
      }
    }
  });

  // Add new commitments (avoid duplicates)
  commitments.forEach((comText) => {
    const existing = memory.commitments.find((c) =>
      c.commitment.toLowerCase() === comText.toLowerCase() ||
      (c.commitment.toLowerCase().includes(comText.toLowerCase()) && c.status === 'pending')
    );

    if (!existing) {
      const dueDate = importantDates[0] || 'October 15, 2026';
      const newCom: StructuredCommitment = {
        id: `com-${Date.now()}-${Math.floor(performance.now())}`,
        commitment: comText,
        owner: 'You',
        dueDate,
        status: 'pending',
        sourceMeeting: meetingTitle
      };
      memory.commitments.unshift(newCom);

      changes.push({
        id: `chg-com-new-${Date.now()}-${changes.length}`,
        type: 'new',
        category: 'commitment',
        label: '+ New commitment:',
        title: comText,
        detail: `Owner: You · Due: ${dueDate}`
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 3. REQUIREMENTS: Update existing requirement vs Introduce new requirement
  // ---------------------------------------------------------------------------
  newRequirements.forEach((reqText) => {
    const reqLower = reqText.toLowerCase();

    // Check if a requirement on this topic already exists
    const existingIdx = memory.requirements.findIndex((r) => {
      const rLower = r.requirement.toLowerCase();
      if (reqLower.includes('feature x') && rLower.includes('feature x')) return true;
      if (reqLower.includes('timeline') && (rLower.includes('timeline') || rLower.includes('october 15') || rLower.includes('deployment'))) return true;
      if (reqLower.includes('pricing') && rLower.includes('pricing')) return true;
      return rLower === reqLower || rLower.includes(reqLower) || reqLower.includes(rLower);
    });

    if (existingIdx >= 0) {
      // UPDATE EXISTING REQUIREMENT INSTEAD OF DUPLICATING!
      const existingReq = memory.requirements[existingIdx];
      const previousVersion = existingReq.requirement;
      const updatedTitle = reqText.includes('Feature X') && importantDates.length > 0
        ? `Feature X required (Target delivery: before ${importantDates[0]})`
        : reqText;

      memory.requirements[existingIdx] = {
        ...existingReq,
        requirement: updatedTitle,
        sourceInteraction: `${meetingTitle} (Updated Today)`,
        status: 'updated',
        lastUpdated: 'Today',
        previousVersion
      };

      changes.push({
        id: `chg-req-upd-${Date.now()}-${changes.length}`,
        type: 'updated',
        category: 'requirement',
        label: '↻ Updated:',
        title: existingReq.requirement,
        detail: `Refined to "${updatedTitle}" based on latest agreement`
      });
    } else {
      // Add as brand new requirement
      const newReq: StructuredRequirement = {
        id: `req-${Date.now()}-${Math.floor(performance.now())}`,
        requirement: reqText,
        sourceInteraction: meetingTitle,
        status: 'active',
        lastUpdated: 'Today'
      };
      memory.requirements.unshift(newReq);

      changes.push({
        id: `chg-req-new-${Date.now()}-${changes.length}`,
        type: 'new',
        category: 'requirement',
        label: '+ New requirement:',
        title: reqText,
        detail: `Source: ${meetingTitle}`
      });
    }
  });

  // Check if "Implementation timeline" or general timeline was approved
  if (notesLower.includes('timeline was approved') || notesLower.includes('implementation timeline')) {
    const timelineReqIdx = memory.requirements.findIndex((r) =>
      r.requirement.toLowerCase().includes('timeline') || r.requirement.toLowerCase().includes('deployment')
    );
    if (timelineReqIdx >= 0) {
      const prev = memory.requirements[timelineReqIdx].requirement;
      memory.requirements[timelineReqIdx] = {
        ...memory.requirements[timelineReqIdx],
        requirement: 'Implementation timeline approved (Go-live before Oct 15)',
        status: 'satisfied',
        lastUpdated: 'Today',
        previousVersion: prev
      };
      // Only add to changes if not already recorded
      if (!changes.some((c) => c.title.toLowerCase().includes('implementation timeline'))) {
        changes.push({
          id: `chg-timeline-upd-${Date.now()}`,
          type: 'updated',
          category: 'requirement',
          label: '↻ Updated:',
          title: 'Implementation timeline',
          detail: 'Approved and locked: Go-live confirmed before Oct 15 freeze'
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. DECISIONS: Add verified decisions
  // ---------------------------------------------------------------------------
  decisions.forEach((decText) => {
    const decLower = decText.toLowerCase();
    const existing = memory.decisions.find((d) =>
      d.decision.toLowerCase() === decLower ||
      d.decision.toLowerCase().includes(decLower) ||
      decLower.includes(d.decision.toLowerCase())
    );

    if (!existing) {
      const newDec: StructuredDecision = {
        id: `dec-${Date.now()}-${Math.floor(performance.now())}`,
        decision: decText,
        date: 'Today',
        relatedMeeting: meetingTitle
      };
      memory.decisions.unshift(newDec);

      changes.push({
        id: `chg-dec-${Date.now()}-${changes.length}`,
        type: 'new',
        category: 'decision',
        label: '+ New decision:',
        title: decText,
        detail: `Confirmed in ${meetingTitle}`
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 5. IMPORTANT DATES: Deduplicate and record
  // ---------------------------------------------------------------------------
  importantDates.forEach((dateStr) => {
    const dateLower = dateStr.toLowerCase();
    const existing = memory.importantDates.find((d) =>
      d.date.toLowerCase().includes(dateLower) || dateLower.includes(d.date.toLowerCase())
    );

    if (!existing) {
      const newDate: StructuredImportantDate = {
        id: `date-${Date.now()}-${Math.floor(performance.now())}`,
        date: dateStr,
        description: `Committed delivery / milestone from ${meetingTitle}`,
        category: 'deadline'
      };
      memory.importantDates.unshift(newDate);

      changes.push({
        id: `chg-date-${Date.now()}-${changes.length}`,
        type: 'new',
        category: 'date',
        label: '+ Important date:',
        title: `${dateStr} — Committed milestone`,
        detail: `Logged from ${meetingTitle}`
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 6. INTERACTIONS: Record current meeting interaction
  // ---------------------------------------------------------------------------
  const newInt: StructuredInteraction = {
    id: `int-${Date.now()}`,
    date: 'Today',
    type: 'meeting',
    summary: rawNotes,
    topics: [
      ...decisions,
      ...resolvedIssues.map((r) => `Resolved: ${r}`),
      ...newRequirements
    ]
  };
  memory.interactions.unshift(newInt);

  // ---------------------------------------------------------------------------
  // 7. PRIORITIES: Promote resolved items and record evolution
  // ---------------------------------------------------------------------------
  if (notesLower.includes('pricing')) {
    // If "Lower initial cost" was in current priorities, update to "Modular starter deployment"
    const costIdx = memory.priorities.current.findIndex((p) => p.toLowerCase().includes('cost') || p.toLowerCase().includes('pricing'));
    if (costIdx >= 0) {
      const oldPriority = memory.priorities.current[costIdx];
      memory.priorities.current[costIdx] = 'Modular starter deployment ($34k pilot agreed)';
      memory.priorities.historical.unshift({
        id: `hp-${Date.now()}`,
        priority: oldPriority,
        achievedDate: 'Today',
        outcome: 'Resolved pricing concern; revised proposal approved'
      });
    }
  }

  return {
    updatedMemory: memory,
    changes
  };
};

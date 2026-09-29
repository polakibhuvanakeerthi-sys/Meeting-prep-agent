import { 
  HindsightGraphData, 
  HindsightNode, 
  HindsightEdge, 
  Contact, 
  Meeting, 
  MemoryItem, 
  Commitment 
} from '../types';

/**
 * ============================================================================
 * FUTURE HINDSIGHT ARCHITECTURE CONTRACT
 * ============================================================================
 * Pipeline Specification:
 * 
 *   [Frontend UI / React Components]
 *                 ↓
 *   [Backend / API Service Gateway]
 *                 ↓
 *   [Hindsight Memory Engine] (Long-term semantic & relationship graph)
 *                 ↓
 *   [AI Reasoning Layer] (Zero-hallucination inference & synthesis)
 *                 ↓
 *   [Meeting Preparation Dossier]
 * 
 * NOTE: Hindsight is NOT integrated yet. This module defines the architecture
 * contract and local adapter bridge so that when the Hindsight SDK / API endpoint
 * is ready, zero changes are required to the presentation layer.
 * ============================================================================
 */

export interface HindsightQueryRequest {
  contactId?: string;
  contactEmail?: string;
  query?: string;
  limit?: number;
  timeframe?: string;
}

export interface HindsightIngestRequest {
  contactId: string;
  meetingId?: string;
  sourceType: 'meeting_notes' | 'email' | 'transcript' | 'manual_entry';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface HindsightSearchResponse {
  nodes: HindsightNode[];
  edges: HindsightEdge[];
  summary: string;
  relevanceScore: number;
}

/**
 * Service Adapter Interface for Hindsight Memory Engine
 */
export interface IHindsightService {
  /** Retrieve relationship knowledge graph for visualization */
  getRelationshipGraph(contact?: Contact | null): Promise<HindsightGraphData>;
  /** Search memory repository with semantic ranking */
  searchMemory(req: HindsightQueryRequest): Promise<HindsightSearchResponse>;
  /** Ingest fresh debrief or note into persistent memory */
  ingestInteraction(req: HindsightIngestRequest): Promise<{ success: boolean; memoryId: string }>;
}

/**
 * Default Hindsight Graph Structure
 * Renders the exact architecture requested:
 * 
 *                 AI MEMORY
 * 
 *       ● Previous Meeting
 *          ↘
 *      ● Decision ─── ● Action Item
 *          ↘
 *       ● Client Preference
 *             ↘
 *          ● Open Issue
 */
export function buildDefaultHindsightGraph(
  contact?: Contact | null,
  memories?: MemoryItem[],
  commitments?: Commitment[]
): HindsightGraphData {
  const contactName = contact?.name || 'Partner Executive';
  const company = contact?.company || 'Ecosystem Partner';

  const nodes: HindsightNode[] = [
    {
      id: 'node-meeting',
      type: 'previous_meeting',
      label: 'Previous Meeting',
      title: `${contactName} - Q3 Alignment`,
      description: `Agreed on core architecture milestones and reviewed implementation budget for ${company}.`,
      timestamp: 'Sep 25, 2026',
      confidence: 0.98,
      tags: ['Executive Sync', 'Milestone Review'],
      x: 160,
      y: 90
    },
    {
      id: 'node-decision',
      type: 'decision',
      label: 'Decision',
      title: 'Restructure to Modular Pricing Tier',
      description: 'Accepted starter tier under $35k to avoid finance escalation.',
      timestamp: 'Sep 25, 2026',
      confidence: 0.96,
      tags: ['Commercial', 'Procurement'],
      x: 120,
      y: 220
    },
    {
      id: 'node-action',
      type: 'action_item',
      label: 'Action Item',
      title: 'Deliver Revised Proposal & Webhook SLA',
      description: 'Send updated commercial order form with 99.9% uptime SLA guarantee.',
      timestamp: 'Due Tomorrow',
      confidence: 0.95,
      tags: ['Deliverable', 'Owner: You'],
      x: 440,
      y: 220
    },
    {
      id: 'node-preference',
      type: 'client_preference',
      label: 'Client Preference',
      title: 'Prefers Live Demos & Technical Benchmarks',
      description: 'Avoid slide decks; open meetings with terminal curls and latency dashboards.',
      timestamp: 'Identified Sep 18',
      confidence: 0.94,
      tags: ['Working Style', 'No Decks'],
      x: 180,
      y: 360
    },
    {
      id: 'node-issue',
      type: 'open_issue',
      label: 'Open Issue',
      title: 'Q4 Engineering Freeze Cutoff (Oct 15)',
      description: 'Must complete deployment kickoff prior to internal infrastructure freeze.',
      timestamp: 'Urgent Blocker',
      confidence: 0.97,
      tags: ['Risk', 'Timeline'],
      x: 400,
      y: 450
    }
  ];

  const edges: HindsightEdge[] = [
    {
      id: 'edge-meeting-decision',
      source: 'node-meeting',
      target: 'node-decision',
      label: 'yielded',
      animated: true
    },
    {
      id: 'edge-decision-action',
      source: 'node-decision',
      target: 'node-action',
      label: 'generated',
      animated: true
    },
    {
      id: 'edge-meeting-preference',
      source: 'node-meeting',
      target: 'node-preference',
      label: 'revealed',
      animated: true
    },
    {
      id: 'edge-preference-issue',
      source: 'node-preference',
      target: 'node-issue',
      label: 'impacts',
      animated: true
    }
  ];

  return { nodes, edges };
}

/**
 * Local Hindsight Adapter Implementation
 * Implements the IHindsightService contract using local state until the real
 * Hindsight backend is attached.
 */
export class HindsightAdapter implements IHindsightService {
  async getRelationshipGraph(contact?: Contact | null): Promise<HindsightGraphData> {
    // Simulated micro-delay for realistic async pipeline
    await new Promise((resolve) => setTimeout(resolve, 40));
    return buildDefaultHindsightGraph(contact);
  }

  async searchMemory(req: HindsightQueryRequest): Promise<HindsightSearchResponse> {
    const graph = buildDefaultHindsightGraph();
    const query = (req.query || '').toLowerCase();
    const matchedNodes = graph.nodes.filter(
      (n) => n.title.toLowerCase().includes(query) || n.description.toLowerCase().includes(query)
    );

    return {
      nodes: matchedNodes.length > 0 ? matchedNodes : graph.nodes,
      edges: graph.edges,
      summary: `Hindsight semantic search retrieved ${matchedNodes.length} related memory nodes.`,
      relevanceScore: 0.96
    };
  }

  async ingestInteraction(req: HindsightIngestRequest): Promise<{ success: boolean; memoryId: string }> {
    return {
      success: true,
      memoryId: `hindsight-${Date.now()}`
    };
  }
}

export const hindsightService = new HindsightAdapter();

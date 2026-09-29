import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Heart, 
  Clock, 
  BrainCircuit, 
  ShieldCheck, 
  Sparkles,
  Link2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card3D } from '../common/Card3D';

export interface MemoryNetworkNode {
  id: string;
  label: string;
  category: 'today' | 'decision' | 'issue' | 'previous_meeting' | 'commitment' | 'preference';
  memory: string;
  date: string;
  source: string;
  relatedMeeting: string;
  importance: 'Critical' | 'High' | 'Medium';
  connectedMemories: string[];
  x: number; // percentage in SVG viewBox
  y: number;
}

const DEFAULT_NETWORK_NODES: MemoryNetworkNode[] = [
  {
    id: 'node-today',
    label: 'TODAY',
    category: 'today',
    memory: 'Active executive briefing session scheduled for today.',
    date: 'Sep 29, 2026',
    source: 'Executive Calendar Sync',
    relatedMeeting: 'Q4 Platform & Enterprise Tier Alignment',
    importance: 'Critical',
    connectedMemories: ['Decision', 'Issue'],
    x: 50,
    y: 12
  },
  {
    id: 'node-decision',
    label: 'Decision',
    category: 'decision',
    memory: 'Approved modular starter tier under $35k to bypass procurement escalation.',
    date: 'Sep 25, 2026',
    source: 'Zoom Transcript · Prior Alignment Sync',
    relatedMeeting: 'Prior Milestone Alignment Sync',
    importance: 'High',
    connectedMemories: ['TODAY', 'Previous Meeting'],
    x: 24,
    y: 36
  },
  {
    id: 'node-issue',
    label: 'Issue',
    category: 'issue',
    memory: 'Company-wide engineering freeze commences on November 1st.',
    date: 'Sep 25, 2026',
    source: '1:1 Debrief Note & Slack Thread',
    relatedMeeting: 'Technical Requirements Scoping',
    importance: 'Critical',
    connectedMemories: ['TODAY', 'Commitment'],
    x: 76,
    y: 36
  },
  {
    id: 'node-prev-meeting',
    label: 'Previous Meeting',
    category: 'previous_meeting',
    memory: 'Technical discovery confirmed webhook audit logging and SSO parameters.',
    date: 'Sep 18, 2026',
    source: 'Google Meet Audio Recording',
    relatedMeeting: 'Technical Requirements Scoping',
    importance: 'Medium',
    connectedMemories: ['Decision', 'Client Preference'],
    x: 24,
    y: 64
  },
  {
    id: 'node-commitment',
    label: 'Commitment',
    category: 'commitment',
    memory: 'You promised to deliver sandbox environment by Oct 12.',
    date: 'Sep 25, 2026',
    source: 'Action Item Tracker',
    relatedMeeting: 'Prior Milestone Alignment Sync',
    importance: 'High',
    connectedMemories: ['Issue'],
    x: 76,
    y: 64
  },
  {
    id: 'node-preference',
    label: 'Client Preference',
    category: 'preference',
    memory: 'Stakeholder strongly prefers bulleted summaries and live terminal demos over slides.',
    date: 'Sep 15, 2026',
    source: 'Relationship Observation History',
    relatedMeeting: 'Initial Partnership Exploration',
    importance: 'High',
    connectedMemories: ['Previous Meeting'],
    x: 24,
    y: 88
  }
];

// Graph edges definition matching prompt schema:
// TODAY -> Decision, Issue
// Decision -> Previous Meeting -> Client Preference
// Issue -> Commitment
const EDGES = [
  { from: 'node-today', to: 'node-decision' },
  { from: 'node-today', to: 'node-issue' },
  { from: 'node-decision', to: 'node-prev-meeting' },
  { from: 'node-prev-meeting', to: 'node-preference' },
  { from: 'node-issue', to: 'node-commitment' }
];

export const AIMemoryGraph: React.FC = () => {
  const [nodes] = useState<MemoryNetworkNode[]>(DEFAULT_NETWORK_NODES);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MemoryNetworkNode>(DEFAULT_NETWORK_NODES[0]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const getNodeVisuals = (node: MemoryNetworkNode) => {
    switch (node.category) {
      case 'today':
        return {
          icon: Clock,
          color: 'text-indigo-400',
          bg: 'bg-indigo-950/80 border-indigo-500/80',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
          dot: 'bg-indigo-400'
        };
      case 'decision':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/70 border-emerald-500/70',
          glow: 'shadow-[0_0_18px_rgba(16,185,129,0.4)]',
          dot: 'bg-emerald-400'
        };
      case 'issue':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-950/70 border-amber-500/70',
          glow: 'shadow-[0_0_18px_rgba(245,158,11,0.4)]',
          dot: 'bg-amber-400'
        };
      case 'previous_meeting':
        return {
          icon: Calendar,
          color: 'text-sky-400',
          bg: 'bg-sky-950/70 border-sky-500/70',
          glow: 'shadow-[0_0_18px_rgba(14,165,233,0.4)]',
          dot: 'bg-sky-400'
        };
      case 'commitment':
        return {
          icon: Target,
          color: 'text-purple-400',
          bg: 'bg-purple-950/70 border-purple-500/70',
          glow: 'shadow-[0_0_18px_rgba(168,85,247,0.4)]',
          dot: 'bg-purple-400'
        };
      case 'preference':
        return {
          icon: Heart,
          color: 'text-rose-400',
          bg: 'bg-rose-950/70 border-rose-500/70',
          glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]',
          dot: 'bg-rose-400'
        };
      default:
        return {
          icon: BrainCircuit,
          color: 'text-slate-400',
          bg: 'bg-slate-900 border-slate-700',
          glow: 'shadow-none',
          dot: 'bg-slate-400'
        };
    }
  };

  const isEdgeHighlighted = (fromId: string, toId: string) => {
    if (!hoveredNodeId) return false;
    return hoveredNodeId === fromId || hoveredNodeId === toId;
  };

  return (
    <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-bold text-white tracking-wide uppercase">
                Interactive Memory Network
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                Hindsight Graph Schema
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live floating relationship network. Hover to highlight connections, click to inspect.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Semantic Linkage Active</span>
        </div>
      </div>

      {/* Main Network Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Visual Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[460px] bg-slate-950/60 rounded-2xl border border-slate-800/90 p-4 flex items-center justify-center overflow-hidden">
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#818cf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {EDGES.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const highlighted = isEdgeHighlighted(edge.from, edge.to);

              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={highlighted ? 'url(#activeLineGrad)' : 'rgba(100, 116, 139, 0.25)'}
                  strokeWidth={highlighted ? '0.75' : '0.4'}
                  strokeDasharray={highlighted && !reducedMotion ? '1.5 1.5' : 'none'}
                  className={highlighted && !reducedMotion ? 'animate-pulse transition-all duration-300' : 'transition-all duration-300'}
                />
              );
            })}
          </svg>

          {/* Floating Nodes */}
          {nodes.map((node, index) => {
            const visuals = getNodeVisuals(node);
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNode.id === node.id;
            const Icon = visuals.icon;

            // Sine wave vertical float offset based on index
            const floatDelayClass = [
              'animate-[float_5s_ease-in-out_infinite]',
              'animate-[float_6s_ease-in-out_infinite_0.5s]',
              'animate-[float_5.5s_ease-in-out_infinite_1s]',
              'animate-[float_6.5s_ease-in-out_infinite_1.5s]',
              'animate-[float_5s_ease-in-out_infinite_2s]',
              'animate-[float_7s_ease-in-out_infinite_2.5s]'
            ][index % 6];

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`z-10 ${reducedMotion ? '' : floatDelayClass}`}
              >
                <button
                  type="button"
                  data-cursor="button"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNode(node)}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    visuals.bg
                  } ${
                    isSelected
                      ? `ring-2 ring-indigo-400 scale-105 ${visuals.glow}`
                      : isHovered
                      ? `scale-105 ${visuals.glow} border-white/40`
                      : 'hover:scale-102 border-slate-700/80 shadow-md'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${visuals.dot} ${isHovered || isSelected ? 'animate-ping' : ''}`} />
                  <Icon className={`w-3.5 h-3.5 ${visuals.color}`} />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {node.label}
                  </span>

                  {/* Micro hover preview tooltip */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-[11px] text-slate-300 shadow-xl pointer-events-none z-30 animate-fade-in backdrop-blur-sm">
                      <p className="font-semibold text-white truncate">{node.memory}</p>
                      <span className="text-[10px] text-indigo-400 block mt-0.5">{node.date}</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Node Inspector Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-inner space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hindsight Memory Inspector
              </span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                selectedNode.importance === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-indigo-950 text-indigo-300 border-indigo-800'
              }`}>
                {selectedNode.importance} Importance
              </span>
            </div>

            {/* Node Title & Category */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white tracking-wide uppercase">
                  {selectedNode.label}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedNode.date}
                </span>
              </div>
            </div>

            {/* Exact Fields Specified in Requirement 10 */}
            <div className="space-y-3.5 text-xs">
              {/* Field 1: Memory */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Memory
                </span>
                <p className="text-xs font-medium text-slate-200 leading-relaxed">
                  {selectedNode.memory}
                </p>
              </div>

              {/* Field 2: Date & Source */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Date
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedNode.date}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Source
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate block">
                    {selectedNode.source}
                  </span>
                </div>
              </div>

              {/* Field 3: Related Meeting */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Related Meeting
                </span>
                <span className="text-xs font-semibold text-indigo-300">
                  {selectedNode.relatedMeeting}
                </span>
              </div>

              {/* Field 4: Connected Memories */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Connected Memories ({selectedNode.connectedMemories.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connectedMemories.map((cm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-800/60 text-indigo-300"
                    >
                      <Link2 className="w-2.5 h-2.5" />
                      {cm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer notice */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Ready for Hindsight Memory Sync</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

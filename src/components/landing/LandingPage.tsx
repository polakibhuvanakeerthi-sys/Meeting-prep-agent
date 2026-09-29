import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  FileText, 
  Link2, 
  Database, 
  Zap, 
  Check, 
  Users, 
  Layers,
  Clock,
  ChevronDown
} from 'lucide-react';
import { MemoryOrb } from '../3d/MemoryOrb';
import { Card3D } from '../common/Card3D';
import { useApp } from '../../context/AppContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
  onReplayIntro?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onEnterDemo,
  onReplayIntro,
}) => {
  const { setIsAuthModalOpen, setAuthMode } = useApp();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white select-none selection:bg-indigo-500 selection:text-white">
      {/* ========================================================================= */}
      {/* NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                MeetMind <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('memory-network')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Memory
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="hidden lg:inline-flex text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Replay cinematic opening sequence"
              >
                Replay Intro
              </button>
            )}
            <button
              onClick={() => {
                setAuthMode('signin');
                setIsAuthModalOpen(true);
              }}
              className="text-xs sm:text-sm font-medium px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION (Animates slowly from down to up) */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Description & CTAs with slow staggered upward rise */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-rise-slow">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Next-Gen Meeting Intelligence & Long-Term Memory</span>
              </div>

              {/* Large Heading */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Walk into every meeting <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">prepared.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed animate-rise-delayed-1">
                MeetMind remembers your conversations, decisions, commitments and context so you can focus on the conversation—not searching through your history.
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-rise-delayed-2">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-base shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>See How It Works</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Demo Sandbox Callout */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 animate-rise-delayed-3">
                <button
                  onClick={onEnterDemo}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Demo Workspace without signup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span>·</span>
                <span>No credit card required</span>
              </div>
            </div>

            {/* Right Column: 3D AI Memory Orb Hero Showcase (Delayed Rise) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative animate-rise-delayed-1">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-slate-900/10 to-transparent dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-950/80 border border-indigo-500/20 dark:border-indigo-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center">
                {/* 3D Memory Orb */}
                <div className="relative my-4">
                  <MemoryOrb size={180} particleCount={60} pulsing interactive />
                </div>

                {/* Live Context Card Overlay */}
                <div className="w-full mt-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                      AI Memory Engine
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Context
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    "Sync with Rahul Sharma regarding ABC Technologies Q4 Pilot"
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Recalling 4 past meetings, 2 open commitments, and resolved modular pricing notes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: "Meetings create information." (Part 8) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The Reality of Every Business Day
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Meetings create information.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Every day, teams negotiate pricing, agree on milestones, voice concerns, and make critical promises across dozens of calls.
            </p>
          </div>

          {/* Animated Meeting Cards / Bubbles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card3D className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Roadmap & Scope Alignment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                "Feature X delivery is mandatory before the October 15 freeze. Scope finalized."
              </p>
            </Card3D>

            <Card3D className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Commercial Agreements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                "Accepted modular starter tier at $34,000 with a 3-week onboarding SLA guarantee."
              </p>
            </Card3D>

            <Card3D className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Stakeholder Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                "Rahul requires security whitepaper approval from the CISO before contract signature."
              </p>
            </Card3D>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: "But important context gets lost." (Part 8) */}
      {/* ========================================================================= */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              The Cost of Context Loss
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              But important context gets lost.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Notes get buried in docs, promises slip through the cracks, and participants walk into follow-up calls asking questions already answered weeks ago.
            </p>
          </div>

          {/* Fading context simulation cards */}
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Forgotten Commitment</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  You promised to email revised pricing terms by Friday, but the note was lost in a transcript.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Unresolved Client Concern</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  The client raised security audit blockers in Meeting #2, but nobody addressed it in Meeting #3.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: "MeetMind remembers." (Part 8) */}
      {/* ========================================================================= */}
      <section id="memory-network" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Persistent Knowledge Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              MeetMind remembers.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              MeetMind extracts and links every essential nuance into a structured relationship memory network.
            </p>
          </div>

          {/* Hierarchical Flow: Meeting -> Decision -> Commitment -> Client Preference -> Open Issue */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 mx-auto flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Meeting</h4>
              <p className="text-[11px] text-slate-500">Timeline source</p>
            </div>

            <div className="text-slate-400 font-bold text-sm">↓</div>

            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Decision</h4>
              <p className="text-[11px] text-slate-500">Agreed outcomes</p>
            </div>

            <div className="text-slate-400 font-bold text-sm">↓</div>

            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Commitment</h4>
              <p className="text-[11px] text-slate-500">Two-way accountability</p>
            </div>

            <div className="text-slate-400 font-bold text-sm">↓</div>

            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 mx-auto flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Client Preference</h4>
              <p className="text-[11px] text-slate-500">Communication & style</p>
            </div>

            <div className="text-slate-400 font-bold text-sm">↓</div>

            <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Open Issue</h4>
              <p className="text-[11px] text-slate-500">Blockers & risks</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: "MeetMind understands the history." (Part 8) */}
      {/* ========================================================================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Connected Neural History
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              MeetMind understands the history.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              It doesn't just store disjointed bullet points. MeetMind correlates past conversations over months to uncover trends, shifting priorities, and unspoken stakeholder sentiments.
            </p>
          </div>

          {/* Interactive Connected Nodes Box */}
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit className="w-64 h-64 text-indigo-400" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                  Knowledge Graph Synthesis
                </span>
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed border-l-2 border-indigo-500 pl-4 italic">
                “Rahul Sharma previously expressed high concern regarding price increases during the Sep 25 meeting. In today's sync, he approved the $34k modular package provided the 3-week SLA is preserved.”
              </blockquote>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  ⚡ Confidence Score: 98%
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  📁 4 Past Touchpoints Synthesized
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ✓ Blocker Mitigated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: "MeetMind prepares you." (Part 8 & 14) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Actionable Executive Briefings
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              MeetMind prepares you.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Meeting → Memory → AI → Instant Meeting Brief. One click generates an 8-section executive dossier with objectives, commitments, and strategic questions.
            </p>
          </div>

          {/* 8-Section Brief Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              { icon: FileText, title: 'Meeting Objective', desc: 'Clear strategic outcomes to achieve.' },
              { icon: Database, title: 'Previous Context', desc: 'Historical takeaways and past alignment.' },
              { icon: Users, title: 'What We Know', desc: 'Stakeholder priorities and communication style.' },
              { icon: ShieldAlert, title: 'Open Issues & Risks', desc: 'Unresolved blockers and mitigation tactics.' },
              { icon: Clock, title: 'Previous Commitments', desc: 'Who promised what and upcoming due dates.' },
              { icon: Sparkles, title: 'Suggested Questions', desc: 'High-leverage discovery and probing questions.' },
              { icon: Layers, title: 'Potential Risks', desc: 'Identified pitfalls before they derail discussions.' },
              { icon: Check, title: 'Recommended Follow-ups', desc: 'Concrete action items to cement next steps.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION (Part 15) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 5-Step Workflow
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              How MeetMind Works
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Designed for professionals who spend their day in high-stakes conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">1</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">CONNECT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your Google Calendar or Microsoft 365 in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">2</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">REMEMBER</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MeetMind stores useful meeting context, commitments, and feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">3</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">UNDERSTAND</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI connects relevant information from previous meetings seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">4</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">PREPARE</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get a personalized 8-section briefing before every upcoming call.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">5</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">FOLLOW UP</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track two-way commitments and unresolved issues effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: Final CTA (Part 8) */}
      {/* ========================================================================= */}
      <section id="about" className="py-24 bg-gradient-to-b from-indigo-900/10 via-indigo-950/30 to-slate-950/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <BrainCircuit className="w-8 h-8" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your next meeting starts here.
          </h2>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join professionals who never walk into a meeting without complete, actionable context.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-base transition-all cursor-pointer"
            >
              Try Demo Workspace
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">MeetMind AI</span>
            <span>· Remember every conversation. Prepare for every meeting.</span>
          </div>
          <p>© 2026 MeetMind AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

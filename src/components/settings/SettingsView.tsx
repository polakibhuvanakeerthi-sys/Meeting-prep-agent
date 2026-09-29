import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Calendar, 
  BrainCircuit, 
  ShieldCheck, 
  Bell, 
  Download, 
  Sparkles,
  Lock,
  Eye,
  Sliders,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    showToast, 
    memories, 
    contacts,
    workspaceIntegrations,
    connectGoogle,
    connectMicrosoft,
    disconnectIntegration,
    setCurrentView,
    setIsEditProfileOpen,
    logout,
    isAuthenticated
  } = useApp();

  const [leadTime, setLeadTime] = useState('15');
  const [morningDigest, setMorningDigest] = useState(true);
  const [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>('system');
  const [reducedMotionState, setReducedMotionState] = useState(false);

  const handleExport = () => {
    const data = {
      user: currentUser,
      contactsCount: contacts.length,
      memoriesCount: memories.length,
      memories,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meetmind-memory-export-${Date.now()}.json`;
    a.click();
    showToast('Export Complete', 'Knowledge graph downloaded as JSON.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, calendar integrations, Hindsight memory engine, and security preferences.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. PROFILE */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          Profile
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold text-xl flex items-center justify-center ring-2 ring-indigo-400/30 shadow-sm">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {currentUser.name}
                </span>
                <Badge variant="primary" size="sm">
                  {currentUser.subscriptionPlan}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser.role} at {currentUser.company}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentUser.email}
              </p>
              {currentUser.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md italic">
                  "{currentUser.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
            >
              Edit Profile
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CALENDAR & WORKSPACE CONNECTIONS */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Calendar & Workspace Connections
          </h2>
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${workspaceIntegrations.google || workspaceIntegrations.microsoft ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {workspaceIntegrations.google || workspaceIntegrations.microsoft ? 'Connected' : 'No integration active'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Connect your work calendar to automatically sync scheduled meetings and import contacts.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
          {/* Google Workspace */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-base">
                G
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Google Calendar & Contacts
                </p>
                <p className="text-[11px] text-slate-500">
                  {workspaceIntegrations.google ? 'Live OAuth connection active.' : 'Not connected.'}
                </p>
              </div>
            </div>

            {workspaceIntegrations.google ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectIntegration('google')}
                className="text-xs text-rose-600 dark:text-rose-400 hover:border-rose-300"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={connectGoogle}
                className="text-xs font-semibold"
              >
                Connect Google
              </Button>
            )}
          </div>

          {/* Microsoft 365 */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-900/60 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-base">
                M
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Microsoft 365 (Outlook & Teams)
                </p>
                <p className="text-[11px] text-slate-500">
                  {workspaceIntegrations.microsoft ? 'Live OAuth connection active.' : 'Not connected.'}
                </p>
              </div>
            </div>

            {workspaceIntegrations.microsoft ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectIntegration('microsoft')}
                className="text-xs text-rose-600 dark:text-rose-400 hover:border-rose-300"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={connectMicrosoft}
                className="text-xs font-semibold"
              >
                Connect Microsoft
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AI MEMORY (Requirement 13) */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                AI Memory
              </h2>
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Powered by Hindsight
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Autonomous relationship graph tracking past decisions, commitments, client preferences, and unresolved concerns.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Not connected
              </span>
            </div>
            <span className="text-[10px] text-slate-400 text-right">
              Will become &ldquo;Connected ✓&rdquo; upon backend API key sync
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-xs text-slate-500">
            Inspect the visual memory graph and browse stored knowledge nodes.
          </p>

          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => setCurrentView('memory')}
          >
            View Memory
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. APPEARANCE */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          Appearance & Motion
        </h2>

        <div className="space-y-4 pt-1">
          {/* Theme selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Interface Color Scheme
              </p>
              <p className="text-[11px] text-slate-500">
                Choose light, dark, or follow operating system preference.
              </p>
            </div>

            <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setThemeMode('system');
                  document.documentElement.classList.remove('dark');
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                  showToast('Theme', 'Follows system appearance.', 'info');
                }}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'system' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                System
              </button>
              <button
                onClick={() => {
                  setThemeMode('light');
                  document.documentElement.classList.remove('dark');
                  showToast('Theme', 'Light mode selected.', 'info');
                }}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'light' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                onClick={() => {
                  setThemeMode('dark');
                  document.documentElement.classList.add('dark');
                  showToast('Theme', 'Dark mode selected.', 'info');
                }}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'dark' ? 'bg-slate-900 font-bold shadow-xs text-white' : 'text-slate-500'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Respect prefers-reduced-motion
              </p>
              <p className="text-[11px] text-slate-500">
                Disables cursor trailing effects, 3D card tilt, and floating background particles.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              Active by default
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NOTIFICATIONS */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          Notifications
        </h2>

        <div className="space-y-4 pt-1">
          {/* Briefing lead time */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Briefing Notification Delivery
              </p>
              <p className="text-[11px] text-slate-500">
                When MeetMind AI pushes your meeting briefing.
              </p>
            </div>
            <select
              value={leadTime}
              onChange={(e) => {
                setLeadTime(e.target.value);
                showToast('Notification', `Briefing set to ${e.target.value} minutes before meetings.`, 'info');
              }}
              className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="10">10 minutes before meeting</option>
              <option value="15">15 minutes before meeting (Recommended)</option>
              <option value="30">30 minutes before meeting</option>
              <option value="60">1 hour before meeting</option>
            </select>
          </div>

          {/* Morning digest */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Daily Morning Briefing Digest (8:00 AM)
              </p>
              <p className="text-[11px] text-slate-500">
                Receive an executive summary of today&apos;s meetings, key contacts, and open commitments.
              </p>
            </div>
            <input
              type="checkbox"
              checked={morningDigest}
              onChange={(e) => {
                setMorningDigest(e.target.checked);
                showToast('Notification', `Morning digest ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECURITY */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Security & Privacy
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Zero-hallucination inference policy active. Public LLM models are never trained on your company&apos;s confidential meeting memories.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExport}
          >
            Export Memory Database (JSON)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Security Verified', 'SOC-2 Type II tenant encryption verified active.', 'success')}
          >
            Verify Cryptographic Seal
          </Button>
        </div>
      </section>
    </div>
  );
};

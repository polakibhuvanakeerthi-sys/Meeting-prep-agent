import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  ChevronRight,
  Sparkles,
  Link2,
  FolderOpen
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const ContactsView: React.FC = () => {
  const { 
    contacts, 
    navigateToContact, 
    setIsAddContactOpen,
    connectGoogle,
    connectMicrosoft,
    loadSampleDataset,
    clearSampleDataset,
    workspaceIntegrations 
  } = useApp();

  const [search, setSearch] = useState('');

  // Filter contacts by search
  const filteredContacts = contacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const getSourceBadge = (source?: string) => {
    if (source === 'sample') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Sample Dossier
        </span>
      );
    }
    if (source === 'connected') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Workspace Synced
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        User Created
      </span>
    );
  };

  const hasSampleData = contacts.some((c) => c.dataSource === 'sample');

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Contacts
            </h1>
            {hasSampleData && (
              <span className="text-[11px] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold px-3 py-0.5 rounded-full border border-amber-300/80 dark:border-amber-800 tracking-wider">
                DEMO WORKSPACE
              </span>
            )}
            {contacts.length > 0 && !hasSampleData && (
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                {contacts.length} Connected
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your relationship memory and interaction dossiers, organized in one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {hasSampleData && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSampleDataset}
              className="text-xs text-slate-600 dark:text-slate-400"
            >
              Clear Demo Data
            </Button>
          )}

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddContactOpen(true)}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search Bar (Requirement 12) */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {contacts.length === 0 ? (
        /* Empty State adhering to Requirement 2 & 12 */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 sm:p-14 text-center space-y-6 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              No contacts connected yet.
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect your calendar or workspace to import contacts.
            </p>
          </div>

          {/* Integration CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={connectGoogle}
              icon={
                <span className="font-bold text-blue-600 text-sm">G</span>
              }
              className="w-full sm:w-auto font-medium"
            >
              Connect Google
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={connectMicrosoft}
              icon={
                <span className="font-bold text-sky-600 text-sm">M</span>
              }
              className="w-full sm:w-auto font-medium"
            >
              Connect Microsoft
            </Button>
          </div>

          {/* Sample dataset option for evaluation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 max-w-sm mx-auto">
            <button
              onClick={loadSampleDataset}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Explore Sample Workspace (Template Dataset)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Contact Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => navigateToContact(contact.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-elevated hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={contact.avatarUrl}
                    alt={contact.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {contact.role} · {contact.company}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  {getSourceBadge(contact.dataSource)}
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-emerald-500" />
                    {contact.warmthScore}%
                  </span>
                </div>
              </div>

              {contact.meetMindRemembers?.summary && (
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {contact.meetMindRemembers.summary}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span>{contact.totalMeetings || 0} meetings</span>
                  <span>·</span>
                  <span>{contact.openCommitmentsCount || 0} open actions</span>
                </div>

                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  View Dossier <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <div className="col-span-full p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No contacts match "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

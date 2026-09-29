import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, BrainCircuit, Tag, Building2, User } from 'lucide-react';
import { Button } from '../common/Button';
import { MemoryCategory } from '../../types';

export const AddMemoryModal: React.FC = () => {
  const { isAddMemoryOpen, setIsAddMemoryOpen, contacts, addMemory } = useApp();

  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [category, setCategory] = useState<MemoryCategory>('personal');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sourceTitle, setSourceTitle] = useState('Direct Interaction');

  if (!isAddMemoryOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !contactId) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addMemory({
      contactId,
      category,
      content,
      tags: tags.length > 0 ? tags : [category],
      sourceMeetingTitle: sourceTitle
    });

    setContent('');
    setTagsInput('');
    setIsAddMemoryOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-float border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/50 dark:border-violet-800/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Ingest Relationship Memory
              </h3>
              <p className="text-xs text-slate-500">
                Teach MeetMind AI a new fact, preference, or decision.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddMemoryOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact *
              </label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Memory Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="personal">Personal Context (Family, Hobbies, Travel)</option>
                <option value="preference">Working Preference (Meeting Style, Comms)</option>
                <option value="decision">Past Decision (Agreed Terms, Pricing)</option>
                <option value="strategic">Strategic Intel (Priorities, Internal Politics)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              What did you learn? *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Maya mentioned she ran the Boulder marathon with a personal record of 1h 48m, and she prefers concise bullet points over decks..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Running, Preferences, Stripe"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Source Attribution
              </label>
              <input
                type="text"
                placeholder="e.g. Coffee Chat or Sep 15 Sync"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddMemoryOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save to Knowledge Graph
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

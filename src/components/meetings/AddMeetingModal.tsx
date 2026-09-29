import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CalendarPlus, Clock, Building2, FileText, Video } from 'lucide-react';
import { Button } from '../common/Button';

export const AddMeetingModal: React.FC = () => {
  const { isAddMeetingOpen, setIsAddMeetingOpen, contacts, addMeeting, navigateToMeetingPrep } = useApp();

  const [title, setTitle] = useState('');
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [date, setDate] = useState('Today');
  const [startTime, setStartTime] = useState('1:00 PM');
  const [endTime, setEndTime] = useState('1:45 PM');
  const [meetingType, setMeetingType] = useState<any>('Strategic Partnership');
  const [location, setLocation] = useState<any>('Google Meet');
  const [purpose, setPurpose] = useState('');

  if (!isAddMeetingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contactId) return;

    addMeeting({
      title,
      contactId,
      date,
      startTime,
      endTime,
      meetingType,
      location,
      purpose: purpose || 'Review milestones and coordinate strategic roadmap.'
    });

    setTitle('');
    setPurpose('');
    setIsAddMeetingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-float border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Schedule Meeting & Generate AI Prep
              </h3>
              <p className="text-xs text-slate-500">
                MeetMind AI will immediately build your briefing dossier.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddMeetingOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Executive Product Alignment Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Participant (Contact) *
              </label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meeting Type
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Strategic Partnership">Strategic Partnership</option>
                <option value="Product Deep-dive">Product Deep-dive</option>
                <option value="Executive Review">Executive Review</option>
                <option value="Technical Architecture">Technical Architecture</option>
                <option value="Contract Renewal">Contract Renewal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="text"
                placeholder="Today or Tomorrow"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="10:30 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="11:15 AM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose & Agenda Notes
            </label>
            <textarea
              rows={3}
              placeholder="What are the goals of this meeting? (MeetMind AI will combine this with past memories)..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddMeetingOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Schedule & Generate Prep
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

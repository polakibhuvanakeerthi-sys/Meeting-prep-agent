import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ViewType, 
  Contact, 
  Meeting, 
  MemoryItem, 
  Commitment, 
  ActivityItem, 
  UserProfile,
  MemoryCategory,
  ExtractedMemoryData,
  TimelineItem,
  StructuredRelationshipMemory,
  MemoryChangeItem,
  MemoryChangeLog
} from '../types';
import { 
  mockCurrentUser, 
  mockContacts, 
  mockMeetings, 
  mockMemories, 
  mockCommitments, 
  mockRecentActivity,
  sampleContacts,
  sampleMeetings
} from '../data/mockData';
import { ensureStructuredMemory, mergeRelationshipMemory } from '../utils/memoryEngine';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedContactId: string | null;
  setSelectedContactId: (id: string | null) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  contacts: Contact[];
  meetings: Meeting[];
  memories: MemoryItem[];
  commitments: Commitment[];
  activity: ActivityItem[];
  currentUser: UserProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;
  isAddMemoryOpen: boolean;
  setIsAddMemoryOpen: (open: boolean) => void;
  isAddMeetingOpen: boolean;
  setIsAddMeetingOpen: (open: boolean) => void;
  isAddContactOpen: boolean;
  setIsAddContactOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastInfo[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  navigateToContact: (contactId: string) => void;
  navigateToMeetingPrep: (meetingId: string) => void;
  toggleCommitment: (commitmentId: string) => void;
  addCommitment: (contactId: string, description: string, type: 'you_owe_them' | 'they_owe_you', dueDate?: string) => void;
  addMemory: (data: {
    contactId: string;
    category: MemoryCategory;
    content: string;
    tags: string[];
    sourceMeetingTitle?: string;
  }) => void;
  deleteMemory: (id: string) => void;
  togglePinMemory: (id: string) => void;
  addContact: (contact: Partial<Contact> & { name: string; role: string; company: string; email: string }) => void;
  addMeeting: (meeting: Partial<Meeting> & { title: string; contactId: string; startTime: string; endTime: string; date: string }) => void;
  toggleTalkingPoint: (meetingId: string, pointId: string) => void;
  applyMeetingMemoryUpdate: (
    contactId: string,
    meetingTitle: string,
    extracted: ExtractedMemoryData,
    rawNotes: string
  ) => void;
  latestMemoryChanges: MemoryChangeItem[] | null;
  setLatestMemoryChanges: (changes: MemoryChangeItem[] | null) => void;
  memoryChangeLogs: MemoryChangeLog[];
  getContactStructuredMemory: (contactId: string) => StructuredRelationshipMemory;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  login: (user?: Partial<UserProfile>) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  workspaceIntegrations: { google: boolean; microsoft: boolean };
  connectGoogle: () => void;
  connectMicrosoft: () => void;
  disconnectIntegration: (provider: 'google' | 'microsoft') => void;
  loadSampleDataset: () => void;
  clearSampleDataset: () => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  
  // Clean state: Contacts empty until workspace is connected or user adds contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  
  // Meetings are explicitly tagged with dataSource: 'sample'
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    mockMeetings.map((m) => ({
      ...m,
      dataSource: 'sample' as const
    }))
  );
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    mockMeetings[0]?.id || null
  );

  const [workspaceIntegrations, setWorkspaceIntegrations] = useState<{
    google: boolean;
    microsoft: boolean;
  }>({
    google: false,
    microsoft: false
  });
  
  const [memories, setMemories] = useState<MemoryItem[]>(mockMemories);
  const [commitments, setCommitments] = useState<Commitment[]>(mockCommitments);
  const [activity, setActivity] = useState<ActivityItem[]>(mockRecentActivity);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('meetmind_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('meetmind_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return mockCurrentUser;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const [latestMemoryChanges, setLatestMemoryChanges] = useState<MemoryChangeItem[] | null>(null);
  const [memoryChangeLogs, setMemoryChangeLogs] = useState<MemoryChangeLog[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const toastCounterRef = React.useRef(0);

  const login = (userData?: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    localStorage.setItem('meetmind_auth', 'true');
    if (userData) {
      setCurrentUser((prev) => {
        const updated = { ...prev, ...userData };
        localStorage.setItem('meetmind_user_profile', JSON.stringify(updated));
        return updated;
      });
    }
    setIsAuthModalOpen(false);
    setCurrentView('dashboard');
    showToast('Signed In', `Welcome, ${userData?.name || currentUser.name || 'User'}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('meetmind_auth');
    setCurrentView('landing');
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('meetmind_user_profile', JSON.stringify(updated));
      return updated;
    });
    setIsEditProfileOpen(false);
    showToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    toastCounterRef.current += 1;
    const id = `toast-${Date.now()}-${toastCounterRef.current}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setCurrentView('contact-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToMeetingPrep = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    const meeting = meetings.find((m) => m.id === meetingId);
    if (meeting) {
      setSelectedContactId(meeting.contactId);
    }
    setCurrentView('meeting-prep');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCommitment = (commitmentId: string) => {
    let completedItem: Commitment | undefined;
    setCommitments((prev) =>
      prev.map((c) => {
        if (c.id === commitmentId) {
          const nextStatus = c.status === 'completed' ? 'pending' : 'completed';
          const updated = { ...c, status: nextStatus as 'completed' | 'pending' };
          if (nextStatus === 'completed') {
            completedItem = updated;
          }
          return updated;
        }
        return c;
      })
    );

    if (completedItem) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4F46E5', '#10B981', '#6366F1']
      });

      const newAct: ActivityItem = {
        id: 'act-' + Date.now(),
        type: 'commitment_completed',
        title: 'Commitment Completed',
        description: completedItem.description,
        timestamp: 'Just now',
        contactName: completedItem.contactName,
        contactCompany: 'Partner',
        badgeText: 'Fulfilled'
      };
      setActivity((prev) => [newAct, ...prev]);

      showToast('Commitment Completed', `"${completedItem.description.slice(0, 48)}..." was marked as done.`, 'success');
    }
  };

  const addCommitment = (contactId: string, description: string, type: 'you_owe_them' | 'they_owe_you', dueDate?: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    const newCom: Commitment = {
      id: 'com-' + Date.now(),
      contactId,
      contactName: contact?.name || 'Contact',
      type,
      description,
      dueDate: dueDate || 'Upcoming',
      status: 'pending',
      createdAt: 'Today'
    };
    setCommitments((prev) => [newCom, ...prev]);
    showToast('New Commitment Added', 'Open loop tracked in relationship graph', 'info');
  };

  const addMemory = (data: {
    contactId: string;
    category: MemoryCategory;
    content: string;
    tags: string[];
    sourceMeetingTitle?: string;
  }) => {
    const contact = contacts.find((c) => c.id === data.contactId);
    const newMemory: MemoryItem = {
      id: 'mem-' + Date.now(),
      contactId: data.contactId,
      contactName: contact ? contact.name : 'Unknown Contact',
      contactCompany: contact ? contact.company : 'Company',
      category: data.category,
      content: data.content,
      sourceMeetingTitle: data.sourceMeetingTitle || 'Direct Observation',
      dateAdded: 'Today',
      confidenceScore: 0.98,
      tags: (data.tags && data.tags.length > 0) ? data.tags : ['Note'],
      pinned: false
    };

    setMemories((prev) => [newMemory, ...prev]);

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'memory_saved',
      title: 'Memory Synthesized',
      description: data.content,
      timestamp: 'Just now',
      contactName: contact?.name || 'Contact',
      contactCompany: contact?.company || 'Company',
      badgeText: data.category.charAt(0).toUpperCase() + data.category.slice(1)
    };
    setActivity((prev) => [newAct, ...prev]);

    showToast('Memory Ingested', `Stored in ${contact?.name || 'Contact'}'s knowledge graph.`, 'success');
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast('Memory Deleted', 'Memory removed from agent context', 'info');
  };

  const togglePinMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    );
  };

  const addContact = (data: Partial<Contact> & { name: string; role: string; company: string; email: string }) => {
    const newContact: Contact = {
      id: 'contact-' + Date.now(),
      name: data.name,
      role: data.role,
      company: data.company,
      email: data.email,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
      location: data.location || 'Remote',
      timezone: data.timezone || 'EST (UTC-5)',
      warmthScore: 70,
      relationshipStatus: data.relationshipStatus || 'In Evaluation',
      lastInteraction: 'Just added (Email)',
      lastMeetingDate: 'Just added',
      totalMeetings: 0,
      totalInteractions: 1,
      openCommitmentsCount: 0,
      tags: data.tags || ['New Relationship'],
      bio: data.bio || `Key contact at ${data.company}.`,
      communicationStyle: data.communicationStyle || 'Responsive via email and Slack.',
      decisionMakingStyle: data.decisionMakingStyle || 'Collaborative stakeholder.',
      keyProjects: data.keyProjects || ['Initial Discovery'],
      keyPriorities: data.keyPriorities || ['Fast implementation', 'Lower initial cost', 'Reliable deployment'],
      knownConcerns: data.knownConcerns || [
        {
          id: 'concern-' + Date.now(),
          title: 'Pricing & Evaluation',
          description: 'Evaluating proposal tiers and implementation scope.',
          severity: 'medium',
          status: 'active'
        }
      ],
      importantRequirements: data.importantRequirements || [
        {
          id: 'req-' + Date.now(),
          title: 'Initial architecture review',
          deadline: 'Next month',
          status: 'pending',
          impact: 'critical'
        }
      ],
      interactionTimeline: data.interactionTimeline || [
        {
          id: 'tl-' + Date.now(),
          date: 'Today',
          type: 'email',
          title: 'Contact profile created',
          summary: `Added ${data.name} to relationship memory bank.`,
          highlight: 'Initialized knowledge graph',
          sourceContext: 'MeetMind AI System'
        }
      ],
      meetMindRemembers: data.meetMindRemembers || {
        summary: `${data.name} is a key stakeholder at ${data.company}. Knowledge graph tracking has begun to synthesize upcoming meetings, emails, and shared commitments.`,
        keyInsights: ['New relationship profile initialized', 'Awaiting first discovery call'],
        synthesisMeta: {
          meetingsCount: 0,
          emailsCount: 1,
          notesCount: 0,
          timespan: 'Just created',
          confidenceScore: 0.9,
          lastInteraction: 'Today'
        }
      },
      dataSource: 'user'
    };

    setContacts((prev) => [newContact, ...prev]);
    setSelectedContactId(newContact.id);
    showToast('Contact Created', `${data.name} added to your network.`, 'success');
  };

  const addMeeting = (data: Partial<Meeting> & { title: string; contactId: string; startTime: string; endTime: string; date: string }) => {
    const contact = contacts.find((c) => c.id === data.contactId);
    const newMeeting: Meeting = {
      id: 'meeting-' + Date.now(),
      title: data.title,
      contactId: data.contactId,
      contactName: contact?.name || 'Contact',
      company: contact?.company || 'Company',
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      isToday: data.date.toLowerCase().includes('today'),
      meetingType: data.meetingType || 'Strategic Partnership',
      location: data.location || 'Google Meet',
      purpose: data.purpose || 'Collaborative alignment and next steps.',
      prepStatus: 'ready',
      dataSource: 'user',
      executiveSummary: `Upcoming sync with ${contact?.name || 'stakeholder'} to discuss key milestones and tactical roadmap items.`,
      keyObjectives: ['Align on near-term deliverables', 'Review mutual open action items', 'Agree on next milestone timeline'],
      talkingPoints: [
        {
          id: 'tp-' + Date.now() + '-1',
          point: `Check in on recent progress at ${contact?.company || 'partner team'}`,
          checked: false,
          category: 'discovery'
        },
        {
          id: 'tp-' + Date.now() + '-2',
          point: 'Review action items and current operational blockers',
          checked: false,
          category: 'priority'
        }
      ],
      strategicQuestions: [
        `“What are the highest priorities for ${contact?.company || 'your team'} over the next quarter?”`
      ],
      attendees: [
        {
          name: contact?.name || 'Contact',
          role: contact?.role || 'Stakeholder',
          company: contact?.company || 'Company',
          email: contact?.email || 'contact@example.com',
          avatarUrl: contact?.avatarUrl || ''
        },
        {
          name: currentUser.name,
          role: currentUser.role,
          company: currentUser.company,
          email: currentUser.email,
          avatarUrl: currentUser.avatarUrl,
          isHost: true
        }
      ]
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    showToast('Meeting Scheduled', `Synced with calendar for ${data.date}.`, 'success');
  };

  const toggleTalkingPoint = (meetingId: string, pointId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          return {
            ...m,
            talkingPoints: m.talkingPoints.map((tp) =>
              tp.id === pointId ? { ...tp, checked: !tp.checked } : tp
            )
          };
        }
        return m;
      })
    );
  };

  const getContactStructuredMemory = (contactId: string): StructuredRelationshipMemory => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return ensureStructuredMemory(contacts[0]);
    }
    return ensureStructuredMemory(contact);
  };

  const applyMeetingMemoryUpdate = (
    contactId: string,
    meetingTitle: string,
    extracted: ExtractedMemoryData,
    rawNotes: string
  ) => {
    const targetContact = contacts.find((c) => c.id === contactId) || contacts[0];
    const currentMemory = ensureStructuredMemory(targetContact);

    // 1. Run the Intelligent Memory Merge Engine
    const { updatedMemory, changes } = mergeRelationshipMemory(
      currentMemory,
      extracted,
      meetingTitle,
      rawNotes
    );

    // 2. Save changes to state for immediate UI visualization
    setLatestMemoryChanges(changes);

    const changeLog: MemoryChangeLog = {
      id: 'log-' + Date.now(),
      contactId: targetContact.id,
      contactName: targetContact.name,
      meetingTitle,
      timestamp: 'Just now',
      changes,
      rawNotes
    };
    setMemoryChangeLogs((prev) => [changeLog, ...prev]);

    let updatedContactName = targetContact.name;

    // 3. Update contact profile, relationship summary, timeline, requirements, and resolved issues
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          updatedContactName = c.name;
          const nextMeetingsCount = c.totalMeetings + 1;
          const nextInteractionsCount = c.totalInteractions + 1;
          const nextWarmth = Math.min(98, c.warmthScore + 5);

          // Add interaction timeline entry
          const newTimelineItem: TimelineItem = {
            id: 'tl-' + Date.now(),
            date: 'Today',
            type: 'meeting',
            title: `${meetingTitle}: Decisions & Requirements Confirmed`,
            summary: rawNotes || 'Reviewed implementation roadmap. Revised pricing accepted, Feature X delivery locked before Oct 15.',
            highlight: changes.map((ch) => ch.title).slice(0, 2).join(' · ') || 'Memory Updated',
            sourceContext: `Meeting (${meetingTitle})`
          };

          // Update AI memory summary
          const updatedSummary = `${c.name} accepted the revised modular pricing during today's meeting. Confirmed Feature X is mandatory with delivery scheduled before October 15. The implementation timeline was officially approved with high confidence.`;
          const updatedInsights = [
            'Pricing concern resolved with modular starter tier ($34k)',
            'Feature X delivery target locked for Oct 15 ahead of Nov 1 freeze',
            ...((c.meetMindRemembers?.keyInsights || []).filter(
              (i) => !i.toLowerCase().includes('pricing')
            ))
          ];

          return {
            ...c,
            warmthScore: nextWarmth,
            lastInteraction: `Today (Meeting: ${meetingTitle})`,
            lastMeetingDate: 'Today',
            totalMeetings: nextMeetingsCount,
            totalInteractions: nextInteractionsCount,
            relationshipStatus: 'Strategic Champion',
            relationshipMemory: updatedMemory,
            knownConcerns: [
              ...updatedMemory.concerns.active.map((a) => ({
                id: a.id,
                title: a.title,
                description: a.description,
                severity: a.severity,
                status: 'active' as const
              })),
              ...updatedMemory.concerns.resolved.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.resolutionNotes,
                severity: 'low' as const,
                status: 'resolved' as const
              }))
            ],
            importantRequirements: updatedMemory.requirements.map((r) => ({
              id: r.id,
              title: r.requirement,
              deadline: extracted.importantDates[0] || 'Oct 15, 2026',
              status: r.status === 'satisfied' ? 'satisfied' as const : 'pending' as const,
              impact: 'critical' as const
            })),
            keyPriorities: updatedMemory.priorities.current,
            interactionTimeline: [newTimelineItem, ...(c.interactionTimeline || [])],
            meetMindRemembers: {
              summary: updatedSummary,
              keyInsights: updatedInsights,
              synthesisMeta: {
                meetingsCount: nextMeetingsCount,
                emailsCount: c.meetMindRemembers?.synthesisMeta?.emailsCount || 5,
                notesCount: (c.meetMindRemembers?.synthesisMeta?.notesCount || 2) + 1,
                timespan: `Accumulated across ${nextMeetingsCount} meetings & 8 touchpoints (Updated Today)`,
                confidenceScore: 0.98,
                lastInteraction: 'Today'
              }
            }
          };
        }
        return c;
      })
    );

    // 4. Update commitments: Mark completed ones & add new ones
    setCommitments((prev) => {
      // Mark matching pending ones completed if mentioned
      const updated = prev.map((com) => {
        if (com.contactId === contactId && com.status === 'pending') {
          const isSatisfied = changes.some(
            (ch) => ch.category === 'commitment' && ch.type === 'resolved' && ch.title.toLowerCase().includes(com.description.toLowerCase().slice(0, 10))
          );
          if (isSatisfied) {
            return { ...com, status: 'completed' as const };
          }
        }
        return com;
      });

      // Add new commitments
      const newFromChanges = changes
        .filter((ch) => ch.category === 'commitment' && ch.type === 'new')
        .map((ch, idx) => ({
          id: 'com-' + Date.now() + '-' + idx,
          contactId,
          contactName: updatedContactName,
          type: 'you_owe_them' as const,
          description: ch.title,
          dueDate: extracted.importantDates[0] || 'Oct 15, 2026',
          status: 'pending' as const,
          createdAt: 'Today',
          meetingTitle
        }));

      return [...newFromChanges, ...updated];
    });

    // 5. Add memory items for knowledge bank
    extracted.decisions.forEach((dec: string, idx: number) => {
      const newMem: MemoryItem = {
        id: 'mem-' + Date.now() + '-' + idx,
        contactId,
        contactName: updatedContactName,
        contactCompany: 'ABC Technologies',
        category: 'decision',
        content: dec,
        sourceMeetingTitle: meetingTitle,
        dateAdded: 'Today',
        confidenceScore: 0.99,
        tags: ['Decision', 'Pricing', 'Agreement'],
        pinned: true
      };
      setMemories((prev) => [newMem, ...prev]);
    });

    // 6. Add Activity feed item summarizing key changes
    const changeSummary = changes
      .map((c) => `${c.label} ${c.title}`)
      .slice(0, 2)
      .join(' · ');

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'memory_saved',
      title: 'Persistent Memory Graph Evolved',
      description: `Debriefed ${meetingTitle}: ${changeSummary || 'Memory updated'}.`,
      timestamp: 'Just now',
      contactName: updatedContactName,
      contactCompany: 'ABC Technologies',
      badgeText: `${changes.length} Memory Updates`
    };
    setActivity((prev) => [newAct, ...prev]);

    // 7. Trigger celebratory confetti & toast
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#6366F1', '#F59E0B']
    });

    showToast(
      'Relationship Memory Saved!',
      `Learned from ${meetingTitle}. ${changes.length} memory changes merged into ${updatedContactName}'s persistent graph.`,
      'success'
    );
  };

  const connectGoogle = () => {
    setWorkspaceIntegrations((prev) => ({ ...prev, google: true }));
    const imported = sampleContacts.map((c) => ({
      ...c,
      dataSource: 'connected' as const,
      relationshipMemory: ensureStructuredMemory(c)
    }));
    setContacts(imported);
    if (imported.length > 0) {
      setSelectedContactId(imported[0].id);
    }
    showToast('Google Workspace Connected', 'Google Calendar & Workspace contacts synced.', 'success');
  };

  const connectMicrosoft = () => {
    setWorkspaceIntegrations((prev) => ({ ...prev, microsoft: true }));
    const imported = sampleContacts.map((c) => ({
      ...c,
      dataSource: 'connected' as const,
      relationshipMemory: ensureStructuredMemory(c)
    }));
    setContacts(imported);
    if (imported.length > 0) {
      setSelectedContactId(imported[0].id);
    }
    showToast('Microsoft 365 Connected', 'Outlook Calendar & Teams contacts synced.', 'success');
  };

  const disconnectIntegration = (provider: 'google' | 'microsoft') => {
    setWorkspaceIntegrations((prev) => ({ ...prev, [provider]: false }));
    showToast(`${provider === 'google' ? 'Google Workspace' : 'Microsoft 365'} Disconnected`, 'Live synchronizations paused.', 'info');
  };

  const loadSampleDataset = () => {
    const samples = sampleContacts.map((c) => ({
      ...c,
      dataSource: 'sample' as const,
      relationshipMemory: ensureStructuredMemory(c)
    }));
    setContacts(samples);
    if (samples.length > 0) {
      setSelectedContactId(samples[0].id);
    }
    showToast('Sample Dataset Loaded', 'Sample template contacts loaded for product evaluation.', 'info');
  };

  const clearSampleDataset = () => {
    setContacts((prev) => prev.filter((c) => c.dataSource !== 'sample'));
    showToast('Sample Data Cleared', 'Sample template contacts removed.', 'info');
  };

  const resetDemoState = () => {
    setContacts([]);
    setMeetings(
      sampleMeetings.map((m) => ({
        ...m,
        dataSource: 'sample' as const
      }))
    );
    setMemories(mockMemories);
    setCommitments(mockCommitments);
    setActivity(mockRecentActivity);
    setLatestMemoryChanges(null);
    setMemoryChangeLogs([]);
    setSelectedContactId(null);
    setSelectedMeetingId(sampleMeetings[0]?.id || null);
    setWorkspaceIntegrations({ google: false, microsoft: false });
    setCurrentView('dashboard');
    showToast('Workspace Reset', 'Workspace returned to initial clean state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedContactId,
        setSelectedContactId,
        selectedMeetingId,
        setSelectedMeetingId,
        contacts,
        meetings,
        memories,
        commitments,
        activity,
        currentUser,
        searchQuery,
        setSearchQuery,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        isAddMemoryOpen,
        setIsAddMemoryOpen,
        isAddMeetingOpen,
        setIsAddMeetingOpen,
        isAddContactOpen,
        setIsAddContactOpen,
        isDarkMode,
        toggleDarkMode,
        toasts,
        showToast,
        removeToast,
        navigateToContact,
        navigateToMeetingPrep,
        toggleCommitment,
        addCommitment,
        addMemory,
        deleteMemory,
        togglePinMemory,
        addContact,
        addMeeting,
        toggleTalkingPoint,
        applyMeetingMemoryUpdate,
        latestMemoryChanges,
        setLatestMemoryChanges,
        memoryChangeLogs,
        getContactStructuredMemory,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isEditProfileOpen,
        setIsEditProfileOpen,
        login,
        logout,
        updateUserProfile,
        workspaceIntegrations,
        connectGoogle,
        connectMicrosoft,
        disconnectIntegration,
        loadSampleDataset,
        clearSampleDataset,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

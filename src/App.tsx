import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandMenu } from './components/layout/CommandMenu';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactDetailView } from './components/contacts/ContactDetailView';
import { MeetingsView } from './components/meetings/MeetingsView';
import { MeetingPrepView } from './components/prep/MeetingPrepView';
import { MemoryView } from './components/memory/MemoryView';
import { UpdateMemoryView } from './components/memory/UpdateMemoryView';
import { SettingsView } from './components/settings/SettingsView';
import { AddMemoryModal } from './components/memory/AddMemoryModal';
import { AddMeetingModal } from './components/meetings/AddMeetingModal';
import { AddContactModal } from './components/contacts/AddContactModal';
import { AuthModal } from './components/auth/AuthModal';
import { EditProfileModal } from './components/settings/EditProfileModal';
import { CustomCursor } from './components/CustomCursor';
import { MemoryBackground } from './components/3d/MemoryBackground';
import { LandingPage } from './components/landing/LandingPage';
import { CinematicIntro } from './components/landing/CinematicIntro';
import { X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, loadSampleDataset } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if cinematic intro was already seen in this session
    const seen = sessionStorage.getItem('meetmind_intro_seen');
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  const handleEnterApp = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDemo = () => {
    loadSampleDataset();
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // If on root landing page
  if (currentView === 'landing') {
    return (
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
        {/* Cinematic Intro Sequence (Plays once per session) */}
        {showIntro && (
          <CinematicIntro onComplete={() => setShowIntro(false)} />
        )}

        {/* 3D Animated Background (Part 5) */}
        <MemoryBackground />

        {/* Custom Glowing Cursor (Part 7) */}
        <CustomCursor />

        {/* Landing Page Content (Parts 3, 8, 15) */}
        <main className="relative z-10">
          <LandingPage
            onEnterApp={handleEnterApp}
            onEnterDemo={handleEnterDemo}
            onReplayIntro={handleReplayIntro}
          />
        </main>

        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'contacts':
        return <ContactsView />;
      case 'contact-details':
        return <ContactDetailView />;
      case 'meetings':
        return <MeetingsView />;
      case 'meeting-prep':
        return <MeetingPrepView />;
      case 'memory':
        return <MemoryView />;
      case 'update-memory':
        return <UpdateMemoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3D Animated Background (Part 5) */}
      <MemoryBackground />

      {/* Futuristic Custom Cursor (Part 7) */}
      <CustomCursor />

      {/* Desktop Sidebar */}
      <div className="relative z-10 hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="relative w-64 max-w-full">
            <Sidebar />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200"
              aria-label="Close mobile navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)}></div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />

        {/* Scrollable View Container with Global Page Transition */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div key={currentView} className="max-w-7xl mx-auto page-transition">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandMenu />
      <AddMemoryModal />
      <AddMeetingModal />
      <AddContactModal />
      <AuthModal />
      <EditProfileModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

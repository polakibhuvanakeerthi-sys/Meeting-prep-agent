import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  BrainCircuit, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    currentUser 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google OAuth interactive prompt state
  const [isGooglePromptOpen, setIsGooglePromptOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  if (!isAuthModalOpen) return null;

  const deriveNameFromEmail = (mail: string) => {
    if (!mail || !mail.includes('@')) return 'User';
    const prefix = mail.split('@')[0].replace(/[._-]/g, ' ');
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userEmail = email.trim() || 'user@company.com';
      const userName = name.trim() || deriveNameFromEmail(userEmail);

      login({
        name: userName,
        email: userEmail,
        role: role.trim() || 'Product Lead',
        company: company.trim() || 'Workspace Inc.',
        avatarUrl: currentUser.avatarUrl || '',
        subscriptionPlan: 'Professional Plan'
      });
    }, 400);
  };

  const handleGoogleClick = () => {
    // If email is already filled in the form, sign in immediately with that email
    if (email.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const userEmail = email.trim();
        const userName = name.trim() || deriveNameFromEmail(userEmail);
        login({
          name: userName,
          email: userEmail,
          role: role.trim() || 'Product Lead',
          company: company.trim() || 'Google Workspace Organization',
          avatarUrl: '',
          subscriptionPlan: 'Google Workspace Connected'
        });
      }, 400);
    } else {
      // Open Google Account entry prompt
      setIsGooglePromptOpen(true);
    }
  };

  const handleGooglePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userEmail = googleEmail.trim();
      const userName = googleName.trim() || deriveNameFromEmail(userEmail);

      login({
        name: userName,
        email: userEmail,
        role: 'Google Workspace Lead',
        company: userEmail.includes('@gmail') ? 'Personal Workspace' : userEmail.split('@')[1] || 'Google Workspace',
        avatarUrl: '',
        subscriptionPlan: 'Google Workspace Connected'
      });
      setIsGooglePromptOpen(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-rise-slow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setIsGooglePromptOpen(false);
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close auth dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google OAuth Step */}
        {isGooglePromptOpen ? (
          <div className="space-y-5 animate-fade-in">
            <button
              type="button"
              onClick={() => setIsGooglePromptOpen(false)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="font-bold text-blue-600 text-xl">G</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your Google account email to sign in to MeetMind AI.
              </p>
            </div>

            <form onSubmit={handleGooglePromptSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Google Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="e.g. yourname@gmail.com or work email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !googleEmail.trim()}
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue with this Google Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Main Auth Form */
          <>
            {/* Brand Header */}
            <div className="text-center space-y-2 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {authMode === 'signin' ? 'Welcome to MeetMind AI' : 'Create your account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {authMode === 'signin' 
                  ? 'Sign in to access your meeting intelligence and relationship memory.' 
                  : 'Start capturing meeting context, commitments, and intelligent prep.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google Sign-in Option (Microsoft removed as requested) */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer group"
              >
                <span className="font-bold text-blue-600 text-sm group-hover:scale-110 transition-transform">G</span>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                or with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Role / Title
                      </label>
                      <div className="relative">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. Lead"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Company
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. Workspace"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

import { useState } from 'react';
import {
  ChefHat,
  GraduationCap,
  Moon,
  RefreshCw,
  Smartphone,
  Sun,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppState } from '../../types';
import { DemoLoginModal } from './DemoLoginModal';

const STUDENT_NAV_ITEMS: {
  id: AppState['activeStudentScreen'];
  label: string;
}[] = [
  { id: 'home', label: 'Overview' },
  { id: 'menu', label: 'Menu' },
  { id: 'slots', label: 'Slots' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'history', label: 'History' },
];

export function Header() {
  const {
    state,
    activeStudent,
    setRole,
    setActiveStudentScreen,
    toggleDarkMode,
    toggleMobilePreview,
    resetDemoData,
  } = useApp();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 h-14 flex items-center transition-colors">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-6 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="size-8 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <UtensilsCrossed className="size-4" />
              </div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white truncate">
                Mess Meter
              </span>
            </div>

            {/* Desktop Student Navigation (hidden on mobile or in phone simulator) */}
            {state.currentRole === 'student' && !state.mobilePreviewMode && (
              <nav className="hidden md:flex items-center gap-1" aria-label="Student navigation">
                {STUDENT_NAV_ITEMS.map((item) => {
                  const isActive = state.activeStudentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveStudentScreen(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Controls: Role Switcher, Persona, Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Role Switcher */}
            <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                  state.currentRole === 'student'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="size-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                  state.currentRole === 'admin'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <ChefHat className="size-3.5" />
                <span className="hidden sm:inline">Mess Admin</span>
              </button>
            </div>

            {/* Persona Switch Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              title="Switch student or admin"
            >
              <User className="size-3.5 text-neutral-400" />
              <span className="hidden lg:inline max-w-[110px] truncate">
                {state.currentRole === 'student' ? activeStudent.name : 'Vikram Rao'}
              </span>
            </button>

            {/* Mobile Simulator Frame Toggle (Active only on Student view) */}
            {state.currentRole === 'student' && (
              <button
                onClick={toggleMobilePreview}
                className={`hidden md:flex items-center p-1.5 rounded-lg border transition-colors ${
                  state.mobilePreviewMode
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Toggle mobile preview"
              >
                <Smartphone className="size-4" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Toggle theme"
            >
              {state.isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Reset data"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Demo Login Modal */}
      <DemoLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Reset Operational Data?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              This will clear all bookings, queue counts, waste logs, and feedback back to baseline defaults.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

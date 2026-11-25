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
import { DemoLoginModal } from './DemoLoginModal';

export function Header() {
  const {
    state,
    activeStudent,
    setRole,
    toggleDarkMode,
    toggleMobilePreview,
    resetDemoData,
  } = useApp();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                  Beat the Mess Rush
                </span>
                <span className="hidden sm:inline-block rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 border border-amber-300 dark:border-amber-800 uppercase tracking-wider">
                  Demo Prototype
                </span>
              </div>
              <div className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
                University Hostel Queue & Plate-Waste Reduction
              </div>
            </div>
          </div>

          {/* Controls: Role Switcher, Persona, Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                  state.currentRole === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="size-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                  state.currentRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ChefHat className="size-3.5" />
                <span className="hidden sm:inline">Mess Admin</span>
              </button>
            </div>

            {/* Persona Switch Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 transition-colors"
              title="Switch demo student or admin"
            >
              <User className="size-3.5 text-slate-400" />
              <span className="hidden md:inline max-w-[110px] truncate">
                {state.currentRole === 'student' ? activeStudent.name : 'Vikram Rao'}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                Switch
              </span>
            </button>

            {/* Mobile Simulator Frame Toggle (Active only on Student view) */}
            {state.currentRole === 'student' && (
              <button
                onClick={toggleMobilePreview}
                className={`hidden md:flex items-center gap-1 p-2 rounded-xl border transition-colors ${
                  state.mobilePreviewMode
                    ? 'bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Toggle Phone Simulator Frame"
              >
                <Smartphone className="size-4" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Toggle Dark / Light Mode"
            >
              {state.isDarkMode ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-slate-600" />
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Reset Demo Data"
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reset Demo Data to Initial State?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will restore realistic 7-day demo queues, bookings, waste logs, and menus across all 3 campus messes.
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

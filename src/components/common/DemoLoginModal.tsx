import {
  Check,
  ChefHat,
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_STUDENTS } from '../../data/initialData';
import { Role } from '../../types';

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLoginModal({ isOpen, onClose }: DemoLoginModalProps) {
  const { state, setRole, setActiveStudentId, setAdminSelectedMessId, setSelectedMessId } = useApp();
  if (!isOpen) return null;

  const handleSelectStudent = (studentId: string) => {
    const student = DEMO_STUDENTS.find((s) => s.id === studentId);
    setActiveStudentId(studentId);
    if (student) {
      setSelectedMessId(student.preferredMessId);
    }
    setRole('student');
    onClose();
  };

  const handleSelectAdmin = (messId: 'north' | 'south' | 'central' = 'north') => {
    setAdminSelectedMessId(messId);
    setRole('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="size-3.5" />
              <span>Simulated Campus Authentication</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Select Demo Persona & Role
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Role 1: Student Profiles */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="size-4 text-blue-600" />
              Student Personas (Mobile-First Interface)
            </span>
            <span className="text-[10px] text-slate-400">3 demo accounts</span>
          </div>

          <div className="space-y-2">
            {DEMO_STUDENTS.map((student) => {
              const isSelected =
                state.currentRole === 'student' &&
                state.activeStudentId === student.id;
              const mess = state.messes[student.preferredMessId];

              return (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student.id)}
                  className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{student.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">
                          {student.rollNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {student.hostel} • Assigned to {mess.name}
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="size-3.5" />
                    </span>
                  ) : (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Login →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Role 2: Admin Profile */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ChefHat className="size-4 text-emerald-600" />
            Mess Manager Admin (Desktop-First Operations)
          </span>

          <div
            onClick={() => handleSelectAdmin('north')}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex items-center justify-between ${
              state.currentRole === 'admin'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-full flex items-center justify-center font-bold text-xs ${
                  state.currentRole === 'admin'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                VR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Mr. Vikram Rao
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Chief Mess In-charge • Access to all 3 messes & analytics
                </div>
              </div>
            </div>

            {state.currentRole === 'admin' ? (
              <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="size-3.5" />
              </span>
            ) : (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Login as Manager →
              </span>
            )}
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          Demo data stored locally in your browser. No password needed.
        </div>
      </div>
    </div>
  );
}

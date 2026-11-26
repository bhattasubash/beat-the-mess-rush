import { FormEvent, useState } from 'react';
import { Check, ChefHat, GraduationCap, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessId } from '../../types';

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLoginModal({ isOpen, onClose }: DemoLoginModalProps) {
  const {
    state,
    setRole,
    setActiveStudentId,
    setAdminSelectedMessId,
    setSelectedMessId,
    registerStudent,
  } = useApp();

  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [hostel, setHostel] = useState('Hostel 1');
  const [preferredMessId, setPreferredMessId] = useState<MessId>('north');
  const [dietPreference, setDietPreference] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectStudent = (studentId: string) => {
    const student = state.students.find((s) => s.id === studentId);
    setActiveStudentId(studentId);
    if (student) {
      setSelectedMessId(student.preferredMessId);
    }
    setRole('student');
    onClose();
  };

  const handleSelectAdmin = (messId: MessId = 'north') => {
    setAdminSelectedMessId(messId);
    setRole('admin');
    onClose();
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;
    setSubmitting(true);
    try {
      await registerStudent({
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        hostel: hostel.trim() || 'Hostel 1',
        room: 'Room 101',
        preferredMessId,
        dietPreference,
      });
      setName('');
      setRollNumber('');
      setShowRegister(false);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Switch Account
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Registered Students */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <GraduationCap className="size-3.5" />
              Students
            </span>
            <button
              onClick={() => setShowRegister((prev) => !prev)}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="size-3" />
              {showRegister ? 'Cancel' : 'Register student'}
            </button>
          </div>

          {showRegister ? (
            <form onSubmit={handleRegister} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 23BCE1012"
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Hostel
                  </label>
                  <input
                    type="text"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Mess
                  </label>
                  <select
                    value={preferredMessId}
                    onChange={(e) => setPreferredMessId(e.target.value as MessId)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1.5 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="north">North</option>
                    <option value="south">South</option>
                    <option value="central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Diet
                  </label>
                  <select
                    value={dietPreference}
                    onChange={(e) =>
                      setDietPreference(e.target.value as 'Veg' | 'Non-Veg')
                    }
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1.5 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 text-white py-2 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Sign in & Save Profile'}
              </button>
            </form>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              {state.students.map((student) => {
                const isSelected =
                  state.currentRole === 'student' &&
                  state.activeStudentId === student.id;
                const mess = state.messes[student.preferredMessId];

                return (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{student.name}</span>
                        <span className="text-[11px] font-normal text-neutral-400 tabular-nums">
                          {student.rollNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {student.hostel} · {mess?.name}
                      </div>
                    </div>
                    {isSelected && <Check className="size-4 text-blue-700" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mess Admin */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <ChefHat className="size-3.5" />
            Mess Administration
          </span>
          <button
            onClick={() => handleSelectAdmin(state.adminSelectedMessId)}
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
          >
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Vikram Rao
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Chief Mess Manager
              </div>
            </div>
            {state.currentRole === 'admin' && (
              <Check className="size-4 text-blue-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

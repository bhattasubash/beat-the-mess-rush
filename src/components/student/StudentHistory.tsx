import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  History,
  MapPin,
  MessageSquare,
  QrCode,
  Sparkles,
  Star,
  Utensils,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SlotBooking } from '../../types';
import { BlurFade } from '../magicui/BlurFade';
import { QrPassModal } from './QrPassModal';

export function StudentHistory() {
  const { state } = useApp();
  const [selectedPass, setSelectedPass] = useState<SlotBooking | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'feedback'>('bookings');

  // Filter bookings for active student
  const studentBookings = state.studentBookings.filter(
    (b) => b.studentId === state.activeStudentId
  );

  // Filter feedback for active student
  const studentFeedbacks = state.feedbacks.filter(
    (f) => f.studentId === state.activeStudentId
  );

  // Calculations for personal waste saved
  const cleanPlateCount = studentFeedbacks.filter(
    (f) => f.leftoverAmount === 'Clean Plate'
  ).length;
  const estimatedKgSaved = (studentBookings.length * 0.18 + cleanPlateCount * 0.22).toFixed(1);

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              My History &amp; Impact
            </h1>
          </div>
        </div>
      </BlurFade>

      {/* Impact Stats Banner */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {studentBookings.length}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Slots Booked
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {cleanPlateCount}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Clean Plates
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {estimatedKgSaved} kg
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Food Saved
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Tab Switcher */}
      <BlurFade delay={0.12}>
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="size-3.5" />
            <span>Booked Slots ({studentBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-3 px-4 transition-colors flex items-center gap-1.5 border-b-2 ${
              activeTab === 'feedback'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquare className="size-3.5" />
            <span>My Feedback ({studentFeedbacks.length})</span>
          </button>
        </div>
      </BlurFade>

      {/* Tab Content: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {studentBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
              No slot bookings found. Book your first slot in the Slot Picker tab!
            </div>
          ) : (
            studentBookings.map((b, idx) => {
              const messInfo = state.messes[b.messId];
              const isConfirmed = b.status === 'Confirmed';
              const isAttended = b.status === 'Attended';

              return (
                <BlurFade key={b.id} delay={0.15 + idx * 0.03}>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isConfirmed
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            : isAttended
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        <Clock className="size-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {b.startTime} – {b.endTime}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isConfirmed
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : isAttended
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {b.meal}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 text-slate-400" />
                            {messInfo?.name || 'Mess'}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{b.date} ({b.timestamp})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {b.bookingCode}
                      </span>
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => setSelectedPass(b)}
                          className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <QrCode className="size-3.5" />
                          <span>QR Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                </BlurFade>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content: Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          {studentFeedbacks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
              No feedback records yet. Share your thoughts after your next meal!
            </div>
          ) : (
            studentFeedbacks.map((f, idx) => (
              <BlurFade key={f.id} delay={0.15 + idx * 0.03}>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {f.meal} at {state.messes[f.messId]?.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {f.date} ({f.timestamp})
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        f.leftoverAmount === 'Clean Plate'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {f.leftoverAmount}
                    </span>
                  </div>

                  {f.leftoverReason && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400">Reason for leftover: </span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {f.leftoverReason}
                      </span>
                    </div>
                  )}

                  {f.comments && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      "{f.comments}"
                    </div>
                  )}
                </div>
              </BlurFade>
            ))
          )}
        </div>
      )}

      {/* QR Modal */}
      {selectedPass && (
        <QrPassModal booking={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
}

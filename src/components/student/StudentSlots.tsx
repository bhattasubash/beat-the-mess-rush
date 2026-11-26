import { useState } from 'react';
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  QrCode,
  Sparkles,
  Users,
  Utensils,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealType, SlotBooking } from '../../types';
import { BlurFade } from '../magicui/BlurFade';
import { ShimmerButton } from '../magicui/ShimmerButton';
import { QrPassModal } from './QrPassModal';

export function StudentSlots() {
  const { state, selectedMessId, bookSlot, cancelBooking } = useApp();
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Lunch');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [activePass, setActivePass] = useState<SlotBooking | null>(null);
  const [bookingFeedback, setBookingFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const mess = state.messes[selectedMessId];

  // Filter slots for current mess and meal
  const slots = state.slots.filter(
    (s) => s.messId === selectedMessId && s.meal === selectedMeal
  );

  // Check if current student has a confirmed booking for this meal
  const currentBooking = state.studentBookings.find(
    (b) =>
      b.studentId === state.activeStudentId &&
      b.meal === selectedMeal &&
      b.status === 'Confirmed'
  );

  const handleBookSlot = (slotId: string) => {
    const res = bookSlot(slotId);
    if (res.success && res.booking) {
      setBookingFeedback({ type: 'success', text: res.message });
      setActivePass(res.booking);
      setSelectedSlotId(null);
    } else {
      setBookingFeedback({ type: 'error', text: res.message });
    }

    setTimeout(() => {
      setBookingFeedback(null);
    }, 4000);
  };

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    setBookingFeedback({ type: 'success', text: 'Slot booking cancelled.' });
    setTimeout(() => setBookingFeedback(null), 3000);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Clock className="size-3" /> Crowd Smoothing Engine
              </span>
              <span className="text-xs text-slate-400">
                {mess.name}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Select 15-Min Slot
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Book your preferred 15-minute arrival window. Keeps lines moving and avoids dining room congestion.
            </p>
          </div>

          {/* Meal Toggle */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-auto">
            {(['Lunch', 'Dinner'] as MealType[]).map((meal) => (
              <button
                key={meal}
                onClick={() => {
                  setSelectedMeal(meal);
                  setSelectedSlotId(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all ${
                  selectedMeal === meal
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Utensils className="size-3.5" />
                <span>{meal}</span>
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Active Booking Banner if already booked */}
      {currentBooking && (
        <BlurFade delay={0.1}>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-neutral-900 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                  <CalendarCheck className="size-5 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Confirmed slot for {selectedMeal}
                  </div>
                  <div className="text-lg font-bold tabular-nums mt-0.5">
                    {currentBooking.startTime} – {currentBooking.endTime}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5 tabular-nums">
                    <span>{currentBooking.bookingCode}</span>
                    <span>{state.messes[currentBooking.messId]?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setActivePass(currentBooking)}
                  className="rounded-xl bg-white text-blue-700 px-3.5 py-2 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <QrCode className="size-4" /> View Pass
                </button>
                <button
                  onClick={() => handleCancel(currentBooking.id)}
                  className="rounded-xl bg-white/15 text-white px-3 py-2 text-xs font-semibold hover:bg-white/25 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </BlurFade>
      )}

      {/* Feedback Alert */}
      {bookingFeedback && (
        <div
          className={`rounded-2xl p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            bookingFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {bookingFeedback.type === 'success' ? (
            <CheckCircle2 className="size-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="size-4 text-rose-600" />
          )}
          <span>{bookingFeedback.text}</span>
        </div>
      )}

      {/* Slots Grid */}
      <BlurFade delay={0.15}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold uppercase tracking-wider">
              Available 15-Minute Dining Slots ({selectedMeal})
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-500" /> Filling fast
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-rose-500" /> Full
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const remaining = Math.max(0, slot.capacity - slot.bookedCount);
              const isFull = slot.bookedCount >= slot.capacity;
              const isCurrent = currentBooking?.slotId === slot.id;
              const isSelected = selectedSlotId === slot.id;

              const percentFilled = Math.round((slot.bookedCount / slot.capacity) * 100);

              let badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
              if (percentFilled >= 90) {
                badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
              } else if (percentFilled >= 60) {
                badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
              }

              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    if (!isFull) {
                      setSelectedSlotId(slot.id);
                    }
                  }}
                  className={`rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                      : isSelected
                      ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-lg ring-2 ring-blue-500'
                      : isFull
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
                      >
                        {isFull ? 'FULL' : `${remaining} left`}
                      </span>
                    </div>

                    {/* Progress Bar of Capacity */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
                        <span>{slot.bookedCount} / {slot.capacity} booked</span>
                        <span>{percentFilled}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            isFull
                              ? 'bg-rose-500'
                              : percentFilled >= 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {isCurrent ? (
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Your Slot
                      </span>
                    ) : isFull ? (
                      <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                        <XCircle className="size-3.5" /> Slot Closed
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        {isSelected ? 'Ready to confirm' : 'Tap to select'}
                      </span>
                    )}

                    {!isFull && !isCurrent && (
                      <input
                        type="radio"
                        name="slotSelect"
                        checked={isSelected}
                        onChange={() => setSelectedSlotId(slot.id)}
                        className="size-4 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BlurFade>

      {/* Shimmer Button for Booking Slot (Explicit user requirement: Shimmer Button for "Book Slot" only!) */}
      {selectedSlotId && (
        <BlurFade delay={0.05}>
          <div className="fixed bottom-20 left-0 right-0 z-40 p-4 max-w-md mx-auto flex justify-center">
            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between px-2 mb-2 text-xs">
                <span className="text-slate-500">Selected Slot:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {slots.find((s) => s.id === selectedSlotId)?.startTime} –{' '}
                  {slots.find((s) => s.id === selectedSlotId)?.endTime}
                </span>
              </div>
              <ShimmerButton
                onClick={() => handleBookSlot(selectedSlotId)}
                className="w-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25"
                shimmerColor="#93c5fd"
                background="radial-gradient(ellipse 80% 50% at 50% 120%,rgba(37,99,235,1),rgba(29,78,216,1))"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-4" />
                  <span>
                    {currentBooking ? 'Change to this Slot' : 'Book Slot'}
                  </span>
                </div>
              </ShimmerButton>
            </div>
          </div>
        </BlurFade>
      )}

      {/* QR Confirmation Modal */}
      {activePass && (
        <QrPassModal booking={activePass} onClose={() => setActivePass(null)} />
      )}
    </div>
  );
}

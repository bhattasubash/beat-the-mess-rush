import { CheckCircle2, Clock, MapPin, QrCode, Utensils, X } from 'lucide-react';
import { SlotBooking } from '../../types';
import { useApp } from '../../context/AppContext';

interface QrPassModalProps {
  booking: SlotBooking | null;
  onClose: () => void;
}

export function QrPassModal({ booking, onClose }: QrPassModalProps) {
  const { state } = useApp();
  if (!booking) return null;

  const mess = state.messes[booking.messId];

  // Helper to render an authentic SVG QR code matrix
  const qrModules = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <Utensils className="size-4" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Dining Fast-Pass
                </span>
                <h3 className="text-sm font-bold">{booking.meal} Entry Token</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-blue-400 shadow-sm">
              <svg className="size-36 text-slate-900" viewBox="0 0 17 17">
                {qrModules.map((row, r) =>
                  row.map((cell, c) =>
                    cell === 1 ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width="1"
                        height="1"
                        fill="currentColor"
                      />
                    ) : null
                  )
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="size-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <QrCode className="size-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Token Code
            </div>
            <div className="text-xl font-black tracking-wider text-blue-600 dark:text-blue-400">
              {booking.bookingCode}
            </div>
          </div>

          {/* Slot & Mess Details */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 text-left text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">Mess Hall</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 text-blue-500" />
                {mess?.name || 'Mess'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">Time Slot</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Clock className="size-3 text-emerald-500" />
                {booking.startTime} – {booking.endTime}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">Student</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block mt-0.5">
                {booking.studentName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">Roll No.</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300 block mt-0.5">
                {booking.rollNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="size-4" />
            <span>Show at Counter Fast-Track Scanner</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

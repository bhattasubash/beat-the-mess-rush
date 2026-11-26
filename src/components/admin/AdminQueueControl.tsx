import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Gauge,
  Info,
  Minus,
  Plus,
  Send,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessId, MessNotice } from '../../types';
import { NumberTicker } from '../magicui/NumberTicker';

export function AdminQueueControl() {
  const {
    state,
    calculateWaitTime,
    calculateCrowdLevel,
    updateQueueCount,
    toggleCounter,
    updateServiceRate,
    updateSlotCapacity,
    broadcastNotice,
  } = useApp();

  const messId = state.adminSelectedMessId;
  const mess = state.messes[messId];
  const { level, waitMinutes, bgClass, colorClass } = calculateCrowdLevel(messId);

  // Notice broadcast form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeType, setNoticeType] = useState<MessNotice['type']>('info');
  const [noticeTarget, setNoticeTarget] = useState<MessId | 'all'>('all');
  const [noticeSentToast, setNoticeSentToast] = useState(false);

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    broadcastNotice(noticeTitle.trim(), noticeMessage.trim(), noticeType, noticeTarget);
    setNoticeTitle('');
    setNoticeMessage('');
    setNoticeSentToast(true);
    setTimeout(() => setNoticeSentToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Real-Time Traffic Regulation</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {mess.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Queue & Capacity Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update queue counts, open/close counters, adjust counter service speeds, and broadcast instant notices to student apps.
          </p>
        </div>

        {/* Live Wait Pill */}
        <div className={`rounded-2xl p-3 border ${bgClass} flex items-center gap-3`}>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Computed Live Wait
            </div>
            <div className="text-lg font-black tabular-nums">
              <NumberTicker value={waitMinutes} decimalPlaces={1} /> minutes
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/40">
            {level}
          </span>
        </div>
      </div>

      {/* Grid of Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Control 1: Queue Count Stepper & Slider */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="size-4 text-blue-600" />
              1. Live Queue Count
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Last updated: {mess.lastUpdated}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <button
              onClick={() => updateQueueCount(messId, mess.queueCount - 10)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            >
              -10
            </button>
            <button
              onClick={() => updateQueueCount(messId, mess.queueCount - 1)}
              className="size-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            >
              <Minus className="size-4" />
            </button>

            <div className="text-center px-4">
              <div className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                <NumberTicker value={mess.queueCount} />
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                students waiting
              </div>
            </div>

            <button
              onClick={() => updateQueueCount(messId, mess.queueCount + 1)}
              className="size-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            >
              <Plus className="size-4" />
            </button>
            <button
              onClick={() => updateQueueCount(messId, mess.queueCount + 10)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            >
              +10
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Slider Adjustment</span>
              <span className="font-mono">{mess.queueCount} students</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={mess.queueCount}
              onChange={(e) => updateQueueCount(messId, Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Control 2: Open Counters & Service Rate */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gauge className="size-4 text-emerald-600" />
              2. Serving Counters & Service Speed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Opening counters immediately divides wait time: $W = Q \div (C \times R)$
            </p>
          </div>

          {/* Active Counters Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Open Food Counters:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {mess.openCounters} of {mess.totalCounters} Active
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: mess.totalCounters + 1 }, (_, i) => i).map((count) => {
                const isActive = mess.openCounters === count;
                return (
                  <button
                    key={count}
                    onClick={() => toggleCounter(messId, count)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      isActive
                        ? count === 0
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count === 0 ? 'Closed' : `${count} Ctr${count > 1 ? 's' : ''}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Rate (Students served per counter per minute) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Counter Service Rate:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {mess.serviceRate} students / counter / min
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1.5, 2.0, 2.5, 3.0].map((rate) => {
                const isSelected = Math.abs(mess.serviceRate - rate) < 0.05;
                return (
                  <button
                    key={rate}
                    onClick={() => updateServiceRate(messId, rate)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rate.toFixed(1)}/min
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control 3: Slot Capacity Setting */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="size-4 text-blue-700" />
              3. Default 15-Minute Slot Capacity
            </h2>
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {mess.slotCapacity} students / slot
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Limits maximum student bookings in any 15-minute window to prevent hall overcrowding.
          </p>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[30, 40, 45, 60].map((cap) => {
              const isSelected = mess.slotCapacity === cap;
              return (
                <button
                  key={cap}
                  onClick={() => updateSlotCapacity(messId, cap)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cap} students
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 4: Send Notice to Students (Animated List on Student Home) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="size-4 text-amber-500" />
              4. Broadcast Notice to Student App
            </h2>
            {noticeSentToast && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="size-3.5" /> Broadcast Live!
              </span>
            )}
          </div>

          <form onSubmit={handleSendNotice} className="space-y-2.5 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Notice Title (e.g. Line Clearing Fast)"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={noticeType}
                  onChange={(e) =>
                    setNoticeType(e.target.value as MessNotice['type'])
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="success">Success (Green)</option>
                  <option value="alert">Alert (Red)</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                required
                rows={2}
                placeholder="Broadcast Message (e.g. Counter 3 just opened for South Mess diners. Less than 2 min wait right now!)"
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-500">Audience:</label>
                <select
                  value={noticeTarget}
                  onChange={(e) =>
                    setNoticeTarget(e.target.value as MessId | 'all')
                  }
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[11px] text-slate-900 dark:text-white"
                >
                  <option value="all">All Campuses</option>
                  <option value="north">North Mess Only</option>
                  <option value="south">South Mess Only</option>
                  <option value="central">Central Mess Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 text-white px-4 py-2 font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="size-3.5" /> Broadcast Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

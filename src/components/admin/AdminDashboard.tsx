import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  Scale,
  TrendingDown,
  Users,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessId } from '../../types';
import { NumberTicker } from '../magicui/NumberTicker';

export function AdminDashboard() {
  const {
    state,
    calculateWaitTime,
    calculateCrowdLevel,
    updateQueueCount,
    toggleCounter,
    setActiveAdminScreen,
    setAdminSelectedMessId,
  } = useApp();

  const selectedMess = state.messes[state.adminSelectedMessId];
  const { level, waitMinutes, bgClass, colorClass } = calculateCrowdLevel(
    state.adminSelectedMessId
  );

  // Total booked slots across all slots today for this mess
  const messSlots = state.slots.filter(
    (s) => s.messId === state.adminSelectedMessId
  );
  const totalBookedSlots = messSlots.reduce((acc, s) => acc + s.bookedCount, 0);
  const totalSlotCapacity = messSlots.reduce((acc, s) => acc + s.capacity, 0);
  const slotFillRate = totalSlotCapacity > 0 ? Math.round((totalBookedSlots / totalSlotCapacity) * 100) : 0;

  // Expected diners (estimated based on pre-commits + booked slots + baseline walk-ins)
  const expectedLunchDiners = 380 + Math.round(totalBookedSlots * 0.6);
  const expectedDinnerDiners = 350 + Math.round(totalBookedSlots * 0.4);
  const todayTotalExpected = expectedLunchDiners + expectedDinnerDiners;

  // Waste logs for this mess
  const messWasteLogs = state.wasteLogs.filter(
    (w) => w.messId === state.adminSelectedMessId
  );
  const todayWasteKg = messWasteLogs
    .filter((w) => w.date === 'Today')
    .reduce((acc, w) => acc + w.wasteWeightKg, 0);
  const avgWastePerPlate = todayWasteKg > 0 ? Math.round((todayWasteKg / 340) * 1000) : 24; // in grams

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Operations Dashboard</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {selectedMess.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Mess Rush & Waste Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminScreen('queue')}
            className="rounded-xl bg-blue-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Clock className="size-3.5" /> Adjust Live Queue
          </button>
          <button
            onClick={() => setActiveAdminScreen('forecast')}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Kitchen Prep Sheet →
          </button>
        </div>
      </div>

      {/* Metric Cards with NumberTicker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Queue & Wait */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Live Queue & Wait
            </span>
            <Users className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
              <NumberTicker value={selectedMess.queueCount} />
            </span>
            <span className="text-xs text-slate-400">students in line</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${bgClass}`}>
              Crowd: {level}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              ~<NumberTicker value={waitMinutes} decimalPlaces={1} /> min wait
            </span>
          </div>
        </div>

        {/* Metric 2: Today's Expected Diners */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Expected Diners Today
            </span>
            <Utensils className="size-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
              <NumberTicker value={todayTotalExpected} />
            </span>
            <span className="text-xs text-slate-400">students</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Lunch: ~{expectedLunchDiners}</span>
            <span>Dinner: ~{expectedDinnerDiners}</span>
          </div>
        </div>

        {/* Metric 3: Booked Slots & Fill Rate */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              15-Min Booked Slots
            </span>
            <Clock className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
              <NumberTicker value={totalBookedSlots} />
            </span>
            <span className="text-xs text-slate-400">/ {totalSlotCapacity} capacity</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Slot Fill Rate:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {slotFillRate}% Allocated
            </span>
          </div>
        </div>

        {/* Metric 4: Plate Waste Summary */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Today's Leftover Waste
            </span>
            <Scale className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              <NumberTicker value={todayWasteKg > 0 ? todayWasteKg : 6.8} decimalPlaces={1} />
            </span>
            <span className="text-xs text-slate-400">kg recorded</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">Avg per plate:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              ~{avgWastePerPlate}g / plate
            </span>
          </div>
        </div>
      </div>

      {/* All 3 Messes Live Status Comparison Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Campus Mess Network — Live Wait & Queue Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formula: People in queue ÷ (Open counters × {selectedMess.serviceRate} students/min)
            </p>
          </div>
          <button
            onClick={() => setActiveAdminScreen('queue')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Manage Counters & Rate <ArrowRight className="size-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Mess Hall</th>
                <th className="pb-3">Queue Count</th>
                <th className="pb-3">Open Counters</th>
                <th className="pb-3">Service Rate</th>
                <th className="pb-3">Estimated Wait</th>
                <th className="pb-3">Crowd Status</th>
                <th className="pb-3 text-right">Quick Queue Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(['north', 'south', 'central'] as MessId[]).map((mId) => {
                const m = state.messes[mId];
                const crowd = calculateCrowdLevel(mId);
                const isCurrent = state.adminSelectedMessId === mId;

                return (
                  <tr
                    key={mId}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      isCurrent ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{m.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.2 rounded font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {m.hostelLabel}
                      </div>
                    </td>

                    <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <NumberTicker value={m.queueCount} /> students
                    </td>

                    <td className="py-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {m.openCounters} / {m.totalCounters} Open
                      </span>
                    </td>

                    <td className="py-3 font-mono text-slate-600 dark:text-slate-400">
                      {m.serviceRate} / min
                    </td>

                    <td className="py-3 font-bold font-mono text-slate-900 dark:text-white">
                      <NumberTicker value={crowd.waitMinutes} decimalPlaces={1} /> min
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${crowd.bgClass}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            crowd.level === 'Low'
                              ? 'bg-emerald-500'
                              : crowd.level === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {crowd.level}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => updateQueueCount(mId, m.queueCount - 5)}
                          className="size-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="Subtract 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateQueueCount(mId, m.queueCount - 1)}
                          className="size-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="Subtract 1"
                        >
                          <Minus className="size-3" />
                        </button>
                        <button
                          onClick={() => updateQueueCount(mId, m.queueCount + 1)}
                          className="size-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="Add 1"
                        >
                          <Plus className="size-3" />
                        </button>
                        <button
                          onClick={() => updateQueueCount(mId, m.queueCount + 5)}
                          className="size-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                          title="Add 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Slot Peak Times & Waste Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Slot Demand Summary */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Slot Capacity Utilization ({selectedMess.name})
            </h3>
            <button
              onClick={() => setActiveAdminScreen('forecast')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Detailed Breakdown →
            </button>
          </div>

          <div className="space-y-2.5">
            {messSlots.slice(0, 5).map((slot) => {
              const pct = Math.round((slot.bookedCount / slot.capacity) * 100);
              const isFull = slot.bookedCount >= slot.capacity;
              return (
                <div key={slot.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {slot.meal} {slot.startTime}–{slot.endTime}
                    </span>
                    <span className="font-mono text-slate-500">
                      {slot.bookedCount} / {slot.capacity} booked{' '}
                      {isFull && <span className="font-bold text-rose-500">(FULL)</span>}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull
                          ? 'bg-rose-500'
                          : pct >= 75
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Waste Observations */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Plate Waste Observations
            </h3>
            <button
              onClick={() => setActiveAdminScreen('waste')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Log New Waste Entry →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {messWasteLogs.slice(0, 4).map((wl) => (
              <div key={wl.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {wl.dishName} ({wl.meal})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {wl.date} • Observed reason: <span className="text-amber-600 font-semibold">{wl.observedReason}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-rose-600 dark:text-rose-400">
                    {wl.wasteWeightKg} kg waste
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {wl.platesWithWaste} / {wl.returnedPlates} plates
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

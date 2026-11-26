import {
  ArrowRight,
  Clock,
  Minus,
  Plus,
  Scale,
  Users,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessId } from '../../types';

export function AdminDashboard() {
  const {
    state,
    calculateCrowdLevel,
    updateQueueCount,
    setActiveAdminScreen,
  } = useApp();

  const selectedMess = state.messes[state.adminSelectedMessId];
  const { label, dotClass, waitMinutes } = calculateCrowdLevel(
    state.adminSelectedMessId
  );

  // Total booked slots across all slots today for this mess
  const messSlots = state.slots.filter(
    (s) => s.messId === state.adminSelectedMessId
  );
  const totalBookedSlots = messSlots.reduce((acc, s) => acc + s.bookedCount, 0);
  const totalSlotCapacity = messSlots.reduce((acc, s) => acc + s.capacity, 0);
  const slotFillRate =
    totalSlotCapacity > 0
      ? Math.round((totalBookedSlots / totalSlotCapacity) * 100)
      : 0;

  // Expected diners derived from actual booked slots & queue
  const expectedLunchDiners = messSlots
    .filter((s) => s.meal === 'Lunch')
    .reduce((acc, s) => acc + s.bookedCount, 0);
  const expectedDinnerDiners = messSlots
    .filter((s) => s.meal === 'Dinner')
    .reduce((acc, s) => acc + s.bookedCount, 0);
  const todayTotalExpected =
    expectedLunchDiners + expectedDinnerDiners + selectedMess.queueCount;

  // Waste logs for this mess
  const messWasteLogs = state.wasteLogs.filter(
    (w) => w.messId === state.adminSelectedMessId
  );
  const todayWasteLogs = messWasteLogs.filter((w) => w.date === 'Today');
  const todayWasteKg = todayWasteLogs.reduce(
    (acc, w) => acc + w.wasteWeightKg,
    0
  );
  const totalReturnedPlates = todayWasteLogs.reduce(
    (acc, w) => acc + w.returnedPlates,
    0
  );
  const avgWastePerPlate =
    totalReturnedPlates > 0
      ? Math.round((todayWasteKg / totalReturnedPlates) * 1000)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {selectedMess.name}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mt-0.5">
            Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminScreen('queue')}
            className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Clock className="size-3.5" />
            Adjust queue
          </button>
          <button
            onClick={() => setActiveAdminScreen('forecast')}
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 px-3.5 py-2 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Prep sheet
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* KPI 1: Queue & Wait */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">Current Queue</span>
            <Users className="size-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {selectedMess.queueCount}
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
            <span className="inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
              <span className={`size-2 rounded-full ${dotClass}`} />
              {label}
            </span>
            <span>~{waitMinutes.toFixed(1)} min wait</span>
          </div>
        </div>

        {/* KPI 2: Expected Diners */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">Expected Diners</span>
            <Utensils className="size-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {todayTotalExpected.toLocaleString()}
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
            <span>Lunch {expectedLunchDiners}</span>
            <span>Dinner {expectedDinnerDiners}</span>
          </div>
        </div>

        {/* KPI 3: Booked Slots */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">Booked Slots</span>
            <Clock className="size-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {totalBookedSlots}{' '}
            <span className="text-base font-medium text-neutral-400">
              / {totalSlotCapacity}
            </span>
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
            {slotFillRate}% filled
          </div>
        </div>

        {/* KPI 4: Leftover Waste */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">Today&apos;s Waste</span>
            <Scale className="size-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {todayWasteKg.toFixed(1)}{' '}
            <span className="text-base font-medium text-neutral-400">kg</span>
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
            {avgWastePerPlate}g per plate
          </div>
        </div>
      </div>

      {/* Live Wait & Queue Overview Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Live Wait &amp; Queue Overview
          </h2>
          <button
            onClick={() => setActiveAdminScreen('queue')}
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            Manage counters <ArrowRight className="size-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="pb-2.5">Mess Hall</th>
                <th className="pb-2.5">Counters</th>
                <th className="pb-2.5">Estimated Wait</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Queue Headcount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {(['north', 'south', 'central'] as MessId[]).map((mId) => {
                const m = state.messes[mId];
                const crowd = calculateCrowdLevel(mId);

                return (
                  <tr
                    key={mId}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3 font-semibold text-neutral-900 dark:text-white">
                      {m.name}
                    </td>

                    <td className="py-3 text-neutral-600 dark:text-neutral-300 tabular-nums">
                      {m.openCounters} / {m.totalCounters}
                    </td>

                    <td className="py-3 font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {crowd.waitMinutes.toFixed(1)} min
                    </td>

                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                        <span className={`size-2 rounded-full ${crowd.dotClass}`} />
                        {crowd.label}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                        <button
                          onClick={() => updateQueueCount(mId, Math.max(0, m.queueCount - 1))}
                          className="size-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-lg transition-colors"
                          aria-label={`Decrease ${m.name} queue`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-10 text-center font-semibold text-neutral-900 dark:text-white tabular-nums">
                          {m.queueCount}
                        </span>
                        <button
                          onClick={() => updateQueueCount(mId, m.queueCount + 1)}
                          className="size-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-lg transition-colors"
                          aria-label={`Increase ${m.name} queue`}
                        >
                          <Plus className="size-3.5" />
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

      {/* Bottom Split: Slot Utilization & Plate Waste Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Slot Utilization */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Slot Utilization
            </h3>
            <button
              onClick={() => setActiveAdminScreen('forecast')}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {messSlots.slice(0, 5).map((slot) => {
              const pct = Math.round((slot.bookedCount / slot.capacity) * 100);
              const isFull = slot.bookedCount >= slot.capacity;
              return (
                <div key={slot.id} className="text-xs space-y-1.5">
                  <div className="flex items-center justify-between tabular-nums">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {slot.meal} {slot.startTime}–{slot.endTime}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {slot.bookedCount} / {slot.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull
                          ? 'bg-red-600'
                          : pct >= 75
                          ? 'bg-amber-500'
                          : 'bg-blue-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plate Waste Log (Two-column table) */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Plate Waste Log
            </h3>
            <button
              onClick={() => setActiveAdminScreen('waste')}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Log entry
            </button>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="pb-2 text-left">Dish</th>
                <th className="pb-2 text-right">Waste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {messWasteLogs.length > 0 ? (
                messWasteLogs.slice(0, 5).map((wl) => (
                  <tr key={wl.id}>
                    <td className="py-2.5 font-medium text-neutral-900 dark:text-white">
                      {wl.dishName}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {wl.wasteWeightKg.toFixed(1)} kg
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-neutral-500 dark:text-neutral-400">
                    No waste entries logged yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

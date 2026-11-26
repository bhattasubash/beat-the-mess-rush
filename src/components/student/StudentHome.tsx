import { useState } from 'react';
import { Bell, Check, QrCode, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime, formatTimeRange } from '../../lib/utils';
import { MessId } from '../../types';
import { QrPassModal } from './QrPassModal';

export function StudentHome() {
  const {
    state,
    selectedMessId,
    setSelectedMessId,
    calculateCrowdLevel,
    setActiveStudentScreen,
    setPreCommit,
    toggleReminder,
  } = useApp();

  const [showQrModal, setShowQrModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const mess = state.messes[selectedMessId];
  const { label, dotClass, waitMinutes } = calculateCrowdLevel(selectedMessId);

  // Active confirmed booking for current student
  const activeBooking = state.studentBookings.find(
    (b) => b.studentId === state.activeStudentId && b.status === 'Confirmed'
  );

  // Lunch dishes for selected mess
  const todayLunchDishes = state.dishes.filter(
    (d) => d.messId === selectedMessId && d.meal === 'Lunch'
  );

  // Compute lowest-occupancy available slots for selected mess
  const bestSlots = [...state.slots]
    .filter((s) => s.messId === selectedMessId && s.bookedCount < s.capacity)
    .sort((a, b) => a.bookedCount / a.capacity - b.bookedCount / b.capacity)
    .slice(0, 2);

  // Reminder state persisted in AppContext
  const reminderKey = `${state.activeStudentId}_${selectedMessId}`;
  const reminderSet = Boolean(state.reminders[reminderKey]);

  // Compute weekly food saved dynamically from pre-commitments & clean-plate feedback
  const preCommitSavingsKg = Object.values(state.studentPreCommits).reduce(
    (sum, item) => {
      if (!item.willEat) return sum + 0.18;
      if (item.portion === 'Small') return sum + 0.08;
      return sum;
    },
    0
  );
  const cleanPlateSavingsKg =
    state.feedbacks.filter((f) => f.leftoverAmount === 'Clean Plate').length *
    0.22;
  const weeklySavedKg =
    Math.round((preCommitSavingsKg + cleanPlateSavingsKg) * 10) / 10;
  const weeklyGoalKg = 25;
  const weeklyProgressPct = Math.min(
    100,
    Math.round((weeklySavedKg / weeklyGoalKg) * 100)
  );

  // Slim status line: only shown when a mess is Packed or a special notice is live
  const packedMess = (['north', 'south', 'central'] as MessId[]).find(
    (id) => calculateCrowdLevel(id).level === 'High'
  );
  const specialNotice = state.notices.find(
    (n) => (n.messId === selectedMessId || n.messId === 'all') && n.type === 'info'
  );
  const statusAlertText = packedMess
    ? `${state.messes[packedMess].name} is currently Packed (${calculateCrowdLevel(packedMess).waitMinutes.toFixed(1)} min wait).`
    : specialNotice
    ? `${specialNotice.title}: ${specialNotice.message}`
    : null;

  return (
    <div className="space-y-4">
      {/* Slim Dismissible Status Line (only when a mess is Packed or special item is live) */}
      {statusAlertText && !bannerDismissed && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`size-2 rounded-full shrink-0 ${
                packedMess ? 'bg-red-600' : 'bg-blue-700'
              }`}
            />
            <span className="truncate">{statusAlertText}</span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 shrink-0 p-0.5"
            aria-label="Dismiss status"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Clean Page Header */}
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          {mess.name}
        </h1>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatRelativeTime(mess.lastUpdated)}
        </span>
      </div>

      {/* Uniform 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {/* Card 1: Live Crowd */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Live Crowd
            </h2>
            <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5 text-xs font-medium">
              {(['north', 'south', 'central'] as MessId[]).map((mId) => {
                const isActive = selectedMessId === mId;
                return (
                  <button
                    key={mId}
                    onClick={() => setSelectedMessId(mId)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      isActive
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {mId === 'north' ? 'North' : mId === 'south' ? 'South' : 'Central'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <div className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {waitMinutes.toFixed(1)}{' '}
              <span className="text-base font-medium text-neutral-500 dark:text-neutral-400">
                min
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              <span className={`size-2 rounded-full ${dotClass}`} />
              <span>{label}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
            <span>{mess.queueCount} in queue</span>
            <span>
              {mess.openCounters}/{mess.totalCounters} counters open
            </span>
          </div>
        </section>

        {/* Card 2: Best Time */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Best Time
          </h2>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {bestSlots.length > 0 ? (
              bestSlots.map((slot, idx) => {
                const ratio = slot.capacity > 0 ? slot.bookedCount / slot.capacity : 0;
                const estWait = Math.max(1, Math.round(ratio * 6));
                return (
                  <div
                    key={slot.id}
                    className={`${idx === 0 ? 'pb-3' : 'pt-3'} flex items-center justify-between gap-2`}
                  >
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                      {estWait <= 3 ? '< 3 min wait' : `~${estWait} min wait`}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-3 text-xs text-neutral-500 dark:text-neutral-400">
                All slots currently full
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => toggleReminder(selectedMessId)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {reminderSet ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span>Reminder set</span>
                </>
              ) : (
                <>
                  <Bell className="size-3.5 text-neutral-400" />
                  <span>Remind me</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActiveStudentScreen('slots')}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              All slots
            </button>
          </div>
        </section>

        {/* Card 3: My Dining Slot */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4 md:col-span-2 lg:col-span-1">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            My Dining Slot
          </h2>

          {activeBooking ? (
            <>
              <div>
                <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {formatTimeRange(activeBooking.startTime, activeBooking.endTime)}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {state.messes[activeBooking.messId]?.name}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {activeBooking.bookingCode}
                </span>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <QrCode className="size-3.5" />
                  Show QR
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                No slot booked for today
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => setActiveStudentScreen('slots')}
                  className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Book slot
                </button>
              </div>
            </>
          )}
        </section>

        {/* Card 4: Today's Lunch Menu */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Today&apos;s Lunch Menu
            </h2>
            <button
              onClick={() => setActiveStudentScreen('menu')}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Full menu
            </button>
          </div>

          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {todayLunchDishes.slice(0, 6).map((dish) => {
              const key = `${state.activeStudentId}_${dish.id}`;
              const commit = state.studentPreCommits[key];
              const willEat = commit?.willEat ?? true;
              const portion = commit?.portion ?? 'Regular';

              return (
                <li
                  key={dish.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <span
                    className={`text-sm font-medium ${
                      willEat
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-400 line-through'
                    }`}
                  >
                    {dish.name}
                  </span>

                  <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 p-0.5 text-xs shrink-0">
                    <button
                      onClick={() => setPreCommit(dish.id, true, portion)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        willEat
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Will eat
                    </button>
                    <button
                      onClick={() => setPreCommit(dish.id, false, portion)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        !willEat
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Card 5: Food Waste Impact */}
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between gap-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Food Waste Impact
          </h2>

          <div>
            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {weeklySavedKg.toFixed(1)} kg
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              saved this week
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${weeklyProgressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
              <span>Weekly goal: {weeklyGoalKg.toFixed(1)} kg</span>
              <span>{weeklyProgressPct}%</span>
            </div>
          </div>
        </section>
      </div>

      {/* QR Pass Modal */}
      {showQrModal && activeBooking && (
        <QrPassModal
          booking={activeBooking}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}

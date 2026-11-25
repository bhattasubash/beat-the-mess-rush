import { useState } from 'react';
import {
  Bell,
  CalendarCheck,
  CheckCircle,
  Clock,
  Flame,
  Info,
  MapPin,
  Sparkles,
  TrendingDown,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessId } from '../../types';
import { AnimatedCircularProgressBar } from '../magicui/AnimatedCircularProgressBar';
import { AnimatedList } from '../magicui/AnimatedList';
import { BentoCard, BentoGrid } from '../magicui/BentoGrid';
import { BlurFade } from '../magicui/BlurFade';
import { NumberTicker } from '../magicui/NumberTicker';
import { QrPassModal } from './QrPassModal';

export function StudentHome() {
  const {
    state,
    selectedMessId,
    setSelectedMessId,
    calculateWaitTime,
    calculateCrowdLevel,
    setActiveStudentScreen,
  } = useApp();

  const [showQrModal, setShowQrModal] = useState(false);

  const mess = state.messes[selectedMessId];
  const { level, waitMinutes, colorClass, bgClass } = calculateCrowdLevel(selectedMessId);

  // Active confirmed booking for current student
  const activeBooking = state.studentBookings.find(
    (b) => b.studentId === state.activeStudentId && b.status === 'Confirmed'
  );

  // Meal menu count
  const todayLunchDishes = state.dishes.filter(
    (d) => d.messId === selectedMessId && d.meal === 'Lunch'
  );

  // Circular progress value: 0 - 20 minutes maps to 0 - 100%
  const gaugePercent = Math.min(100, Math.round((waitMinutes / 20) * 100));

  // Determine gauge color based on crowd level
  let gaugePrimary = '#10b981'; // green for Low
  if (level === 'Medium') gaugePrimary = '#f59e0b'; // amber
  if (level === 'High') gaugePrimary = '#ef4444'; // red

  return (
    <div className="space-y-5 pb-20">
      {/* Welcome & Mess Selector */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Sparkles className="size-3" /> Live Campus Dining
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                • {mess.lastUpdated}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Beat the Rush
            </h1>
          </div>

          {/* Quick Mess Switcher */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-semibold self-start sm:self-auto">
            {(['north', 'south', 'central'] as MessId[]).map((mId) => {
              const m = state.messes[mId];
              const mCrowd = calculateCrowdLevel(mId);
              const isActive = selectedMessId === mId;
              return (
                <button
                  key={mId}
                  onClick={() => setSelectedMessId(mId)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{m.name.split(' ')[0]}</span>
                  <span
                    className={`size-2 rounded-full ${
                      mCrowd.level === 'Low'
                        ? 'bg-emerald-500'
                        : mCrowd.level === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </BlurFade>

      {/* Live Notices using AnimatedList */}
      <BlurFade delay={0.1}>
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Bell className="size-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Mess Announcements
            </span>
          </div>
          <AnimatedList delay={3500}>
            {state.notices.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3.5 py-2 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      n.type === 'alert'
                        ? 'bg-rose-500'
                        : n.type === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                      {n.title}:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {n.message}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400 font-mono">
                  {n.timestamp}
                </span>
              </div>
            ))}
          </AnimatedList>
        </div>
      </BlurFade>

      {/* Main Bento Grid */}
      <BlurFade delay={0.15}>
        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Live Crowd Meter & Estimated Wait */}
          <BentoCard
            name="Live Crowd Meter"
            description={`${mess.name} • ${mess.hostelLabel}`}
            Icon={Users}
            cta="View queue control"
            onClick={() => setActiveStudentScreen('slots')}
            className="md:col-span-1 lg:col-span-1"
          >
            <div className="flex flex-col items-center justify-center py-2">
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={gaugePercent}
                gaugePrimaryColor={gaugePrimary}
                gaugeSecondaryColor="#94a3b8"
                className="size-36"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    <NumberTicker value={waitMinutes} decimalPlaces={1} />
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    min wait
                  </span>
                </div>
              </AnimatedCircularProgressBar>

              {/* Status Badge with rule: always text label + green/amber/red */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${bgClass}`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      level === 'Low'
                        ? 'bg-emerald-500 animate-pulse'
                        : level === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  Crowd Level: {level}
                </span>
              </div>

              {/* Live details */}
              <div className="mt-4 grid grid-cols-2 gap-2 w-full text-center text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">
                    People in Line
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    <NumberTicker value={mess.queueCount} /> students
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2">
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">
                    Active Counters
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {mess.openCounters} of {mess.totalCounters} Open
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Suggested Best Time to Visit */}
          <BentoCard
            name="Suggested Best Time"
            description="AI-recommended low-traffic windows to skip queues"
            Icon={Clock}
            cta="Book slot"
            onClick={() => setActiveStudentScreen('slots')}
            className="md:col-span-1 lg:col-span-1"
          >
            <div className="space-y-3 pt-2">
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <TrendingDown className="size-4" /> Lunch Window
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    Lowest wait &lt;3m
                  </span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {mess.bestTimeLunch}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Queue drops by 70% after 1:15 PM once initial wave completes.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/70 dark:border-indigo-900/40 dark:bg-indigo-950/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                    <TrendingDown className="size-4" /> Dinner Window
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                    Calmest
                  </span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {mess.bestTimeDinner}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Ideal before late-evening library rush.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: My Dining Slot / Fast-Pass */}
          <BentoCard
            name="My Dining Slot"
            description="Your pre-booked priority queue pass"
            Icon={CalendarCheck}
            cta={activeBooking ? 'View Fast-Pass' : 'Book a slot'}
            onClick={() => {
              if (activeBooking) {
                setShowQrModal(true);
              } else {
                setActiveStudentScreen('slots');
              }
            }}
            className="md:col-span-2 lg:col-span-1"
          >
            {activeBooking ? (
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                      Active Booking
                    </span>
                    <div className="text-xl font-black mt-0.5">
                      {activeBooking.startTime} – {activeBooking.endTime}
                    </div>
                    <div className="text-xs text-blue-100 mt-0.5">
                      {activeBooking.meal} • {state.messes[activeBooking.messId]?.name}
                    </div>
                  </div>
                  <span className="rounded-full bg-white/20 p-2 text-white">
                    <CheckCircle className="size-5" />
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-100">
                    {activeBooking.bookingCode}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQrModal(true);
                    }}
                    className="font-bold underline text-white hover:text-blue-200"
                  >
                    Tap for QR Code →
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No slot booked for today yet.
                </p>
                <button
                  onClick={() => setActiveStudentScreen('slots')}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <CalendarCheck className="size-3.5" /> Book 15-Min Slot
                </button>
              </div>
            )}
          </BentoCard>

          {/* Card 4: Today's Menu & Portion Pre-Commitment */}
          <BentoCard
            name="Today's Lunch Menu"
            description="Pre-select portion to reduce plate waste"
            Icon={UtensilsCrossed}
            cta="Select portions"
            onClick={() => setActiveStudentScreen('menu')}
            className="md:col-span-2 lg:col-span-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {todayLunchDishes.slice(0, 6).map((dish) => {
                const key = `${state.activeStudentId}_${dish.id}`;
                const commit = state.studentPreCommits[key];
                const willEat = commit?.willEat ?? true;
                const portion = commit?.portion ?? 'Regular';

                return (
                  <div
                    key={dish.id}
                    className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-2.5 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {dish.category}
                        </span>
                        <span
                          className={`size-2 rounded-full ${
                            dish.diet === 'Veg'
                              ? 'bg-emerald-500'
                              : dish.diet === 'Non-Veg'
                              ? 'bg-rose-500'
                              : 'bg-emerald-600'
                          }`}
                        />
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {dish.name}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      {willEat ? (
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {portion} Portion
                        </span>
                      ) : (
                        <span className="font-medium text-slate-400 line-through">
                          Skipped
                        </span>
                      )}
                      <span className="text-slate-400 text-[10px]">
                        {dish.calories} kcal
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>

          {/* Card 5: Campus Waste Prevention Impact */}
          <BentoCard
            name="Food Waste Impact"
            description="Our hostel's mission to reduce leftover food"
            Icon={Flame}
            className="md:col-span-1 lg:col-span-1"
          >
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    <NumberTicker value={17.8} decimalPlaces={1} /> kg
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    Today's total leftover waste
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    -53% vs Last Week
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                Students choosing Small or Regular portions saved an estimated 24 kg of cooked food today!
              </p>
            </div>
          </BentoCard>
        </BentoGrid>
      </BlurFade>

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

import { Bell, CheckCircle2, Clock, MapPin, MessageSquare, Utensils } from 'lucide-react';
import { CROWD_META, formatAlertLabel, MENU_BY_MEAL, MESS_HALLS } from '../data/messData';
import {
  CrowdLevel,
  DishChoice,
  FeedbackEntry,
  MealType,
  MessId,
  ReminderInfo,
  ScreenId,
} from '../types';

interface DesktopCompanionProps {
  currentScreen: ScreenId;
  selectedMessId: MessId;
  breakTime: string;
  meal: MealType;
  crowdByMess: Record<MessId, CrowdLevel>;
  activeReminder: ReminderInfo | null;
  votes: Record<string, DishChoice>;
  voteSubmittedAt: string | null;
  feedbackLog: FeedbackEntry[];
  onNavigate: (screen: ScreenId) => void;
  onSelectMess: (messId: MessId) => void;
}

const FLOW_STEPS: { id: ScreenId; step: number; title: string; subtitle: string }[] = [
  { id: 'setup', step: 1, title: 'Setup', subtitle: 'Select mess & break' },
  { id: 'now', step: 2, title: 'Now', subtitle: 'Live crowd meter' },
  { id: 'best-time', step: 3, title: 'Best Time', subtitle: 'Calm break windows' },
  { id: 'reminder', step: 4, title: 'Reminder Set', subtitle: 'Alert confirmation' },
  { id: 'menu-vote', step: 5, title: 'Menu Vote', subtitle: 'Dish portion tally' },
  { id: 'feedback', step: 6, title: 'Feedback', subtitle: '1-tap mess report' },
];

export function DesktopCompanion({
  currentScreen,
  selectedMessId,
  breakTime,
  meal,
  crowdByMess,
  activeReminder,
  votes,
  voteSubmittedAt,
  feedbackLog,
  onNavigate,
  onSelectMess,
}: DesktopCompanionProps) {
  const dishes = MENU_BY_MEAL[meal];
  const eatingDishes = dishes.filter(
    (d) => (votes[d.id] ?? d.defaultChoice) === 'eat'
  );

  return (
    <aside className="hidden lg:flex flex-col gap-6 flex-1 min-w-0">
      {/* Header & 6-Screen Flow Navigation */}
      <section className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Utensils className="w-5 h-5 text-[#111827]" />
              <h2 className="text-[22px] leading-[28px] font-bold text-[#111827] tracking-tight">
                Mess Meter
              </h2>
            </div>
            <p className="text-[14px] text-[#4B5563]">
              Interactive 6-screen flow · Tap inside the mobile screen or jump
              directly between steps below.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[12px] font-medium text-[#6B7280] block">
              Class break
            </span>
            <span className="text-[18px] font-bold text-[#111827] tabular-nums">
              {breakTime}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {FLOW_STEPS.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`min-h-[56px] p-3 rounded-lg border-2 text-left transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                  isActive
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#111827]'
                    : 'border-[#D1D5DB] bg-[#F9FAFB] text-[#111827] hover:bg-[#F3F4F6] hover:border-[#9CA3AF]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[12px] font-semibold text-[#6B7280] tabular-nums">
                    0{item.step}. {item.title}
                  </span>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                  )}
                </div>
                <span className="text-[13px] font-medium text-[#4B5563] block truncate">
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* All Hostel Messes Live Comparison */}
      <section className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-[18px] leading-[24px] font-semibold text-[#111827]">
              Campus Dining Halls
            </h3>
            <p className="text-[13px] text-[#6B7280]">
              Select any mess to inspect its live wait time and calm slots.
            </p>
          </div>
          <span className="text-[13px] font-medium text-[#6B7280] tabular-nums">
            4 Messes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MESS_HALLS.map((hall) => {
            const level = crowdByMess[hall.id];
            const isSelected = hall.id === selectedMessId;
            return (
              <button
                key={hall.id}
                type="button"
                onClick={() => onSelectMess(hall.id)}
                className={`p-3.5 rounded-lg border-2 text-left transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                  isSelected
                    ? 'border-[#111827] bg-[#F3F4F6]'
                    : 'border-[#D1D5DB] bg-white hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-4 h-4 text-[#4B5563] shrink-0" />
                    <span className="text-[15px] font-semibold text-[#111827] truncate">
                      {hall.shortName}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] font-bold px-2 py-0.5 rounded border tabular-nums shrink-0 ${
                      level === 'Calm'
                        ? 'bg-white border-[#D1D5DB] text-[#111827]'
                        : level === 'Busy'
                          ? 'bg-[#111827] border-[#111827] text-white'
                          : 'bg-[#F3F4F6] border-[#9CA3AF] text-[#111827]'
                    }`}
                  >
                    {level}
                  </span>
                </div>
                <div className="text-[13px] text-[#6B7280] flex items-center gap-2 tabular-nums">
                  <span>Wait: {CROWD_META[level].waitEstimate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{hall.walkingMinutes} min walk</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Real-time User Activity Summary */}
      <section className="bg-white border border-[#D1D5DB] rounded-xl p-6 shadow-sm">
        <h3 className="text-[18px] leading-[24px] font-semibold text-[#111827] mb-4">
          Your Plan &amp; Submissions
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Reminder card */}
          <div className="p-3.5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4B5563] mb-1.5">
              <Bell className="w-4 h-4" />
              <span>Reminder</span>
            </div>
            {activeReminder ? (
              <div>
                <div className="text-[15px] font-bold text-[#111827] tabular-nums">
                  {formatAlertLabel(activeReminder.alertTime)}
                </div>
                <div className="text-[12px] text-[#6B7280] mt-0.5 tabular-nums">
                  Slot {activeReminder.slotRange}
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-[#6B7280]">
                No reminder set yet. Pick a calm window in Best Time.
              </div>
            )}
          </div>

          {/* Menu vote card */}
          <div className="p-3.5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4B5563] mb-1.5">
              <Clock className="w-4 h-4" />
              <span>{meal} Vote</span>
            </div>
            <div className="text-[15px] font-bold text-[#111827] tabular-nums">
              {eatingDishes.length} of {dishes.length} dishes
            </div>
            <div className="text-[12px] text-[#6B7280] mt-0.5 truncate">
              {eatingDishes.length > 0
                ? eatingDishes.map((d) => d.name).join(', ')
                : 'All skipped'}
              {voteSubmittedAt ? ` · Saved ${voteSubmittedAt}` : ''}
            </div>
          </div>

          {/* Feedback log card */}
          <div className="p-3.5 bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4B5563] mb-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Feedback Sent</span>
            </div>
            {feedbackLog.length > 0 ? (
              <div>
                <div className="text-[15px] font-bold text-[#111827] truncate">
                  {feedbackLog[0].issueTitle}
                </div>
                <div className="text-[12px] text-[#6B7280] mt-0.5 truncate tabular-nums">
                  {feedbackLog.length} report{feedbackLog.length > 1 ? 's' : ''}{' '}
                  · {feedbackLog[0].timestamp}
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-[#6B7280]">
                No issues reported today.
              </div>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}

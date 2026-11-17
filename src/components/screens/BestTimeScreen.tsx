import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import { getCalmTimeSlots } from '../../data/messData';
import { MealType, MessHall, ReminderInfo, TimeSlot } from '../../types';

interface BestTimeScreenProps {
  mess: MessHall;
  breakTime: string;
  meal: MealType;
  activeReminder: ReminderInfo | null;
  onChangeMeal: (meal: MealType) => void;
  onBackToNow: () => void;
  onRemindMe: (slot: TimeSlot) => void;
}

const MEALS: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];

export function BestTimeScreen({
  mess,
  breakTime,
  meal,
  activeReminder,
  onChangeMeal,
  onBackToNow,
  onRemindMe,
}: BestTimeScreenProps) {
  const slots = getCalmTimeSlots(breakTime, meal, mess.id);

  return (
    <>
      {/* Header bar with back to Now */}
      <div className="px-6 py-3 border-b border-[#D1D5DB] bg-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBackToNow}
            aria-label="Back to Now"
            className="min-h-[48px] min-w-[44px] -ml-2 px-2 py-1 flex items-center justify-center text-[#4B5563] hover:text-[#111827] rounded cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] leading-[24px] font-semibold text-[#111827] truncate">
            Calmer times today
          </h1>
        </div>
        <select
          aria-label="Select meal"
          value={meal}
          onChange={(e) => onChangeMeal(e.target.value as MealType)}
          className="text-[13px] px-2.5 py-1.5 bg-[#F3F4F6] border border-[#D1D5DB] rounded text-[#4B5563] font-medium cursor-pointer focus:border-[#2563EB] focus:outline-none"
        >
          {MEALS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-5 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <p className="text-[16px] leading-[24px] text-[#4B5563]">
              Expected crowd forecast for {mess.shortName} based on average
              student arrivals.
            </p>
          </div>

          {/* 3 Cards showing time ranges and level labels */}
          <div className="space-y-3.5">
            {slots.map((slot) => {
              const isSelectedReminder =
                activeReminder?.slotId === slot.id &&
                activeReminder?.messId === mess.id &&
                activeReminder?.meal === meal;

              return (
                <div
                  key={slot.id}
                  className={`p-4 border-2 rounded-xl transition ${
                    slot.recommended
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-sm'
                      : 'border-[#D1D5DB] bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[18px] leading-[24px] font-bold text-[#111827] tabular-nums">
                          {slot.start} to {slot.end}
                        </span>
                        <span
                          className={`px-2 py-0.5 border border-[#D1D5DB] text-[#111827] text-[13px] font-semibold rounded ${
                            slot.recommended ? 'bg-white' : 'bg-[#F3F4F6]'
                          }`}
                        >
                          {slot.level}
                        </span>
                      </div>

                      {slot.recommended ? (
                        <div className="flex items-center gap-1 text-[#2563EB] text-[13px] font-semibold mt-1">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{slot.note}</span>
                        </div>
                      ) : (
                        <div className="text-[13px] font-medium text-[#6B7280] mt-1">
                          {slot.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between gap-3 ${
                      slot.recommended ? 'border-blue-200' : 'border-[#D1D5DB]'
                    }`}
                  >
                    <span className="text-[13px] font-medium text-[#6B7280] tabular-nums">
                      Wait: ~{slot.waitMinutes} min
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemindMe(slot)}
                      className="min-h-[48px] px-5 py-2.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                    >
                      <Bell className="w-[18px] h-[18px]" />
                      <span>{isSelectedReminder ? 'Update alert' : 'Remind me'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-2 text-center">
          <span className="text-[13px] font-medium text-[#6B7280]">
            Tap &ldquo;Remind me&rdquo; to open Screen 4 (Reminder Set)
          </span>
        </div>
      </main>
    </>
  );
}

import { ArrowLeft, Check, Vote } from 'lucide-react';
import { formatAlertLabel } from '../../data/messData';
import { MessHall, ReminderInfo } from '../../types';

interface ReminderSetScreenProps {
  mess: MessHall;
  reminder: ReminderInfo;
  onVoteDishes: () => void;
  onBackToNow: () => void;
}

export function ReminderSetScreen({
  mess,
  reminder,
  onVoteDishes,
  onBackToNow,
}: ReminderSetScreenProps) {
  return (
    <>
      <main className="flex-1 px-6 py-10 flex flex-col items-center justify-between text-center">
        <div className="w-full flex flex-col items-center my-auto">
          {/* Tick Icon in large circle */}
          <div className="w-20 h-20 rounded-full border-4 border-[#9CA3AF] bg-[#F3F4F6] flex items-center justify-center mb-6 shadow-inner">
            <Check className="w-11 h-11 text-[#111827]" strokeWidth={2.5} />
          </div>

          <h1 className="text-[28px] leading-[34px] font-bold text-[#111827] mb-3 text-balance">
            Reminder set
          </h1>
          <p className="text-[18px] leading-[24px] text-[#4B5563] max-w-[280px] mb-2">
            We will remind you at{' '}
            <span className="font-bold text-[#111827] tabular-nums">
              {reminder.alertTime}
            </span>
          </p>
          <p className="text-[13px] leading-[18px] font-medium text-[#6B7280] max-w-[260px]">
            5 minutes before the{' '}
            <span className="tabular-nums">
              {reminder.slotRange.replace(' - ', ' to ')}
            </span>{' '}
            calm window so you can beat the crowd.
          </p>

          {/* Summary card */}
          <div className="w-full mt-8 p-4 bg-[#F3F4F6] border border-[#D1D5DB] rounded-xl text-left space-y-2">
            <div className="flex items-center justify-between text-[13px] font-medium text-[#4B5563] gap-2">
              <span>Destination:</span>
              <span className="font-semibold text-[#111827] text-right">
                {mess.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-medium text-[#4B5563] gap-2">
              <span>Target slot:</span>
              <span className="font-semibold text-[#111827] tabular-nums text-right">
                {reminder.slotRange} ({reminder.slotLevel})
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-medium text-[#4B5563] gap-2">
              <span>Notification alert:</span>
              <span className="font-semibold text-[#111827] tabular-nums text-right">
                {formatAlertLabel(reminder.alertTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-6 border-t border-[#D1D5DB]">
          <button
            type="button"
            onClick={onVoteDishes}
            className="w-full min-h-[48px] px-6 py-3.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <span>Vote on dishes</span>
            <Vote className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onBackToNow}
            className="w-full min-h-[48px] px-6 py-3.5 bg-white border-2 border-[#D1D5DB] text-[#111827] text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#F3F4F6] active:scale-[0.99] transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Now</span>
          </button>
        </div>
      </main>

      <footer className="py-2.5 bg-[#F3F4F6] border-t border-[#D1D5DB] text-center shrink-0">
        <span className="text-[12px] text-[#6B7280]">
          Focused confirmation view · Direct links to Next / Home
        </span>
      </footer>
    </>
  );
}

import { useState } from 'react';
import { ArrowRight, ChevronDown, Clock, Info, Utensils } from 'lucide-react';
import { MESS_HALLS } from '../../data/messData';
import { MessId } from '../../types';

interface SetupScreenProps {
  selectedMessId: MessId;
  breakTime: string;
  onSaveSetup: (messId: MessId, breakTime: string) => void;
}

export function SetupScreen({
  selectedMessId,
  breakTime,
  onSaveSetup,
}: SetupScreenProps) {
  const [draftMess, setDraftMess] = useState<MessId>(selectedMessId);
  const [draftTime, setDraftTime] = useState<string>(breakTime);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftTime.trim();
    if (!/^\d{1,2}:\d{2}$/.test(trimmed)) {
      setError('Enter a valid 24-hour time like 12:30');
      return;
    }
    const [h, m] = trimmed.split(':').map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      setError('Hours must be 00–23 and minutes 00–59');
      return;
    }
    const normalized = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setError('');
    onSaveSetup(draftMess, normalized);
  };

  return (
    <main className="flex-1 px-6 py-7 flex flex-col justify-between">
      <form id="setup-form" onSubmit={handleSubmit} className="space-y-6">
        {/* App Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-dashed border-[#9CA3AF] rounded-lg flex items-center justify-center bg-[#F3F4F6] shrink-0">
            <Utensils className="w-5 h-5 text-[#4B5563]" />
          </div>
          <div>
            <h2 className="text-[18px] leading-[24px] font-semibold text-[#111827]">
              Mess Meter
            </h2>
            <p className="text-[13px] leading-[18px] font-medium text-[#6B7280]">
              Hostel dining &amp; crowd companion
            </p>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-[28px] leading-[34px] font-bold text-[#111827] tracking-tight mb-2 text-balance">
            Where do you eat?
          </h1>
          <p className="text-[16px] leading-[24px] text-[#4B5563]">
            Set your hostel mess and daily class break to check rush times
            before walking over.
          </p>
        </div>

        {/* Form Controls */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="mess-select"
              className="block text-[16px] leading-[20px] font-semibold text-[#111827] mb-2"
            >
              Select your mess
            </label>
            <div className="relative">
              <select
                id="mess-select"
                value={draftMess}
                onChange={(e) => setDraftMess(e.target.value as MessId)}
                className="w-full min-h-[48px] pl-4 pr-11 py-3 bg-white border-2 border-[#D1D5DB] rounded-lg text-[16px] font-medium text-[#111827] focus:border-[#2563EB] focus:outline-none appearance-none cursor-pointer"
              >
                {MESS_HALLS.map((mess) => (
                  <option key={mess.id} value={mess.id}>
                    {mess.optionLabel}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#4B5563]">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-1.5 text-[13px] leading-[18px] font-medium text-[#6B7280]">
              You can change this mess anytime in settings or live view.
            </p>
          </div>

          <div>
            <label
              htmlFor="break-time"
              className="block text-[16px] leading-[20px] font-semibold text-[#111827] mb-2"
            >
              Usual class break time (e.g. 12:30)
            </label>
            <div className="relative">
              <input
                type="text"
                id="break-time"
                inputMode="numeric"
                value={draftTime}
                onChange={(e) => {
                  setDraftTime(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. 12:30"
                className="w-full min-h-[48px] pl-4 pr-11 py-3 bg-white border-2 border-[#D1D5DB] rounded-lg text-[16px] font-medium text-[#111827] tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#6B7280]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            {error ? (
              <p className="mt-1.5 text-[13px] font-medium text-red-600">
                {error}
              </p>
            ) : (
              <p className="mt-1.5 text-[13px] leading-[18px] font-medium text-[#6B7280]">
                Used to recommend quiet slots that match your timetable.
              </p>
            )}
          </div>

          <div className="p-3.5 bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg flex items-start gap-2.5">
            <Info className="w-5 h-5 text-[#4B5563] shrink-0 mt-0.5" />
            <p className="text-[13px] leading-[18px] font-medium text-[#4B5563]">
              Recommendations sync automatically with your break window and live
              student crowd check-ins.
            </p>
          </div>
        </div>
      </form>

      {/* Action Footer */}
      <div className="pt-6 mt-8 border-t border-[#D1D5DB]">
        <button
          type="submit"
          form="setup-form"
          className="w-full min-h-[48px] px-6 py-3.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="mt-3 text-center">
          <span className="text-[13px] font-medium text-[#6B7280]">
            Leads to Screen 2 (Now: Live Crowd Meter)
          </span>
        </div>
      </div>
    </main>
  );
}

import { useState } from 'react';
import {
  Brush,
  CheckCircle2,
  MailCheck,
  Send,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import { FEEDBACK_OPTIONS } from '../../data/messData';
import { FeedbackIssueId, MealType, MessHall } from '../../types';

interface FeedbackScreenProps {
  mess: MessHall;
  meal: MealType;
  lastSentMessage: string | null;
  onSendFeedback: (issueId: FeedbackIssueId, note: string) => void;
  onReturnToNow: () => void;
}

const ISSUE_ICONS: Record<FeedbackIssueId, typeof Users> = {
  queue: Users,
  uneaten: UtensilsCrossed,
  cleanliness: Brush,
};

export function FeedbackScreen({
  mess,
  meal,
  lastSentMessage,
  onSendFeedback,
  onReturnToNow,
}: FeedbackScreenProps) {
  const [selectedIssue, setSelectedIssue] = useState<FeedbackIssueId>('queue');
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendFeedback(selectedIssue, note.trim());
    setNote('');
  };

  return (
    <>
      {/* App Header */}
      <div className="px-6 py-4 border-b border-[#D1D5DB] bg-white flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-[18px] leading-[24px] font-semibold text-[#111827] truncate">
            What happened?
          </h1>
          <p className="text-[13px] leading-[18px] font-medium text-[#6B7280] truncate">
            {mess.shortName} · Quick 1-tap feedback
          </p>
        </div>
        <span className="text-[13px] px-2.5 py-1 bg-[#F3F4F6] border border-[#D1D5DB] rounded text-[#4B5563] font-semibold whitespace-nowrap shrink-0">
          Mess Team
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-5 flex flex-col justify-between">
        <form id="feedback-form" onSubmit={handleSubmit}>
          <p className="text-[16px] leading-[24px] text-[#4B5563] mb-4">
            Select an issue you experienced during {meal.toLowerCase()} today:
          </p>

          {/* 3 Large Tap Options */}
          <div
            className="space-y-3 mb-5"
            role="radiogroup"
            aria-label="Issue type"
          >
            {FEEDBACK_OPTIONS.map((option) => {
              const Icon = ISSUE_ICONS[option.id];
              const isSelected = selectedIssue === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedIssue(option.id)}
                  className={`w-full min-h-[54px] px-4 py-3 border-2 rounded-xl flex items-center justify-between text-left transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                    isSelected
                      ? 'border-[#111827] bg-[#111827] text-white shadow-sm'
                      : 'border-[#D1D5DB] bg-white hover:bg-[#F3F4F6] text-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-6 h-6 shrink-0 ${
                        isSelected ? 'text-white' : 'text-[#4B5563]'
                      }`}
                    />
                    <div className="min-w-0">
                      <span
                        className={`text-[16px] leading-[20px] block ${
                          isSelected ? 'font-bold' : 'font-semibold'
                        }`}
                      >
                        {option.title}
                      </span>
                      <span
                        className={`text-[12px] block ${
                          isSelected ? 'text-gray-200' : 'text-[#6B7280]'
                        }`}
                      >
                        {option.subtitle}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Optional One-Line Text Box */}
          <div className="mb-4">
            <label
              htmlFor="optional-note"
              className="block text-[16px] leading-[20px] font-semibold text-[#111827] mb-2"
            >
              Optional note
            </label>
            <input
              type="text"
              id="optional-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a short detail if needed..."
              className="w-full min-h-[48px] px-4 py-3 bg-white border-2 border-[#D1D5DB] rounded-lg text-[16px] text-[#111827] focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          {/* Confirmation Banner */}
          {lastSentMessage && (
            <div
              role="status"
              className="p-3 bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg flex items-center gap-2.5"
            >
              <MailCheck className="w-5 h-5 text-[#111827] shrink-0" />
              <span className="text-[13px] font-medium text-[#111827]">
                {lastSentMessage}
              </span>
            </div>
          )}
        </form>

        {/* Action Footer */}
        <div className="pt-4 mb-2">
          <button
            type="submit"
            form="feedback-form"
            className="w-full min-h-[48px] px-6 py-3.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <span>Send</span>
            <Send className="w-5 h-5" />
          </button>
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={onReturnToNow}
              className="text-[13px] font-medium text-[#6B7280] hover:underline cursor-pointer py-1 px-2"
            >
              ← Return to Now screen
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

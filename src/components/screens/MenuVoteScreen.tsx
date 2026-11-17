import { Check, X } from 'lucide-react';
import { MENU_BY_MEAL } from '../../data/messData';
import { DishChoice, MealType, MessHall } from '../../types';

interface MenuVoteScreenProps {
  mess: MessHall;
  meal: MealType;
  votes: Record<string, DishChoice>;
  lastSubmittedAt: string | null;
  onToggleVote: (dishId: string, choice: DishChoice) => void;
  onSubmitVote: () => void;
}

export function MenuVoteScreen({
  mess,
  meal,
  votes,
  lastSubmittedAt,
  onToggleVote,
  onSubmitVote,
}: MenuVoteScreenProps) {
  const dishes = MENU_BY_MEAL[meal];
  const eatingCount = dishes.filter(
    (d) => (votes[d.id] ?? d.defaultChoice) === 'eat'
  ).length;

  return (
    <>
      {/* App Header */}
      <div className="px-6 py-3 border-b border-[#D1D5DB] bg-white flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-[18px] leading-[24px] font-semibold text-[#111827] truncate">
            Today&apos;s {meal.toLowerCase()}
          </h1>
          <p className="text-[13px] leading-[18px] font-medium text-[#6B7280] truncate">
            {mess.shortName} · Help mess staff reduce food waste
          </p>
        </div>
        <span className="text-[13px] px-2.5 py-1 bg-[#F3F4F6] border border-[#D1D5DB] rounded text-[#4B5563] font-semibold whitespace-nowrap shrink-0 tabular-nums">
          {dishes.length} Dishes
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-5 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <p className="text-[16px] leading-[24px] text-[#4B5563]">
              Mark what you plan to take so the kitchen can prepare accurate
              portion counts:
            </p>
          </div>

          {/* 4 Dish Rows */}
          <div className="space-y-3">
            {dishes.map((dish) => {
              const choice = votes[dish.id] ?? dish.defaultChoice;
              const isEat = choice === 'eat';

              return (
                <div
                  key={dish.id}
                  className="p-3.5 border-2 border-[#D1D5DB] rounded-xl bg-white flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded border border-[#D1D5DB] bg-[#F3F4F6] flex items-center justify-center font-bold text-[#4B5563] shrink-0 tabular-nums">
                      {dish.number}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[18px] leading-[22px] font-semibold text-[#111827] block truncate">
                        {dish.name}
                      </span>
                      <span className="text-[13px] leading-[18px] font-medium text-[#6B7280] block truncate">
                        {dish.description}
                      </span>
                    </div>
                  </div>

                  {/* Two Toggle Chips: I will eat / Skip */}
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    role="group"
                    aria-label={`Portion choice for ${dish.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleVote(dish.id, 'eat')}
                      aria-pressed={isEat}
                      className={`min-h-[48px] px-2.5 py-2 text-[13px] rounded-lg border flex items-center gap-1 transition cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                        isEat
                          ? 'bg-[#111827] text-white border-[#111827] font-semibold'
                          : 'bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB] font-medium hover:bg-gray-200'
                      }`}
                    >
                      {isEat && <Check className="w-4 h-4 shrink-0" />}
                      <span>I will eat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleVote(dish.id, 'skip')}
                      aria-pressed={!isEat}
                      className={`min-h-[48px] px-2.5 py-2 text-[13px] rounded-lg border flex items-center gap-1 transition cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                        !isEat
                          ? 'bg-[#111827] text-white border-[#111827] font-semibold'
                          : 'bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB] font-medium hover:bg-gray-200'
                      }`}
                    >
                      {!isEat && <X className="w-4 h-4 shrink-0" />}
                      <span>Skip</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[13px] font-medium text-[#6B7280] tabular-nums">
            <span>
              Selected: {eatingCount} eating · {dishes.length - eatingCount}{' '}
              skipped
            </span>
            {lastSubmittedAt && <span>Saved at {lastSubmittedAt}</span>}
          </div>
        </div>

        {/* Action Footer: Submit */}
        <div className="pt-4 mb-2">
          <button
            type="button"
            onClick={onSubmitVote}
            className="w-full min-h-[48px] px-6 py-3.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <span>Submit</span>
            <Check className="w-5 h-5" />
          </button>
          <div className="mt-2 text-center">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Saves vote &amp; proceeds to Screen 6 (Feedback) →
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

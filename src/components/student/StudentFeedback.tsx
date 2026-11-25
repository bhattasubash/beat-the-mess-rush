import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeftoverAmount, LeftoverReason, MealType } from '../../types';
import { BlurFade } from '../magicui/BlurFade';

export function StudentFeedback() {
  const { state, selectedMessId, submitFeedback, setActiveStudentScreen } = useApp();
  const [meal, setMeal] = useState<MealType>('Lunch');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [leftoverAmount, setLeftoverAmount] = useState<LeftoverAmount>('Clean Plate');
  const [leftoverReason, setLeftoverReason] = useState<LeftoverReason | undefined>(undefined);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mess = state.messes[selectedMessId];
  const mealDishes = state.dishes.filter(
    (d) => d.messId === selectedMessId && d.meal === meal
  );

  const handleRating = (dishId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [dishId]: rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      messId: selectedMessId,
      meal,
      dishRatings: ratings,
      leftoverAmount,
      leftoverReason: leftoverAmount === 'Clean Plate' ? undefined : leftoverReason,
      comments: comments.trim() || undefined,
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setRatings({});
    setLeftoverAmount('Clean Plate');
    setLeftoverReason(undefined);
    setComments('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Heart className="size-3" /> Voice of the Diner
              </span>
              <span className="text-xs text-slate-400">
                {mess.name}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Meal & Waste Feedback
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Help the mess manager adjust recipes, portion sizing, and temperature to eliminate plate waste.
            </p>
          </div>

          {/* Meal Toggle */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-auto">
            {(['Lunch', 'Dinner'] as MealType[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMeal(m);
                  handleReset();
                }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all ${
                  meal === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Utensils className="size-3.5" />
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      {submitted ? (
        <BlurFade delay={0.1}>
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-8 text-center shadow-lg">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Your ratings and plate observation have been logged directly into the Mess Manager's Waste Analytics Dashboard.
            </p>

            {leftoverAmount === 'Clean Plate' ? (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="size-3.5" /> Clean Plate Hero! +10 Green Campus Points
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                Notice forwarded: We will calibrate "{leftoverReason || 'Portions'}" for tomorrow.
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Submit Another Response
              </button>
              <button
                onClick={() => setActiveStudentScreen('history')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 font-semibold text-xs text-white hover:bg-blue-700 transition-colors"
              >
                View in My History →
              </button>
            </div>
          </div>
        </BlurFade>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Dish Rating */}
          <BlurFade delay={0.1}>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                1. How was the food today? (Rate dishes)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tap 1 to 5 stars for dishes you consumed today.
              </p>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-3">
                {mealDishes.map((dish) => {
                  const currentRating = ratings[dish.id] || 0;
                  return (
                    <div
                      key={dish.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {dish.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({dish.category})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(dish.id, star)}
                            className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-400 transition-colors"
                          >
                            <Star
                              className={`size-5 ${
                                star <= currentRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : ''
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono text-slate-500 ml-2 w-6 text-center">
                          {currentRating > 0 ? `${currentRating}/5` : '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BlurFade>

          {/* Section 2: Leftover Food & Reasons */}
          <BlurFade delay={0.15}>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="size-4 text-blue-600 dark:text-blue-400" />
                  2. Leftover on your plate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Did you finish your food or return leftover on the tray?
                </p>
              </div>

              {/* Amount buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Clean Plate', '< 25%', '25% - 50%', '> 50%'] as LeftoverAmount[]).map(
                  (amt) => {
                    const isSelected = leftoverAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLeftoverAmount(amt)}
                        className={`rounded-xl p-3 text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? amt === 'Clean Plate'
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>{amt}</div>
                        <div className="text-[10px] font-normal opacity-80 mt-0.5">
                          {amt === 'Clean Plate'
                            ? 'Zero Waste'
                            : amt === '< 25%'
                            ? 'A few bites'
                            : amt === '25% - 50%'
                            ? 'Quarter to half'
                            : 'Majority left'}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Reason selector (Portion too big, taste, too cold, no time, other) */}
              {leftoverAmount !== 'Clean Plate' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    What was the primary reason for leftover food?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(
                      [
                        'Portion too big',
                        'Taste',
                        'Too cold',
                        'No time',
                        'Other',
                      ] as LeftoverReason[]
                    ).map((reason) => {
                      const isChosen = leftoverReason === reason;
                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setLeftoverReason(reason)}
                          className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                            isChosen
                              ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {reason}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional comments */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-slate-400" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. Sambhar had too much salt, or Phulka counter moved very swiftly..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </BlurFade>

          {/* Submit Button */}
          <BlurFade delay={0.2}>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-3.5 px-6 font-bold text-sm text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <ThumbsUp className="size-4" />
              <span>Submit Meal Feedback</span>
            </button>
          </BlurFade>
        </form>
      )}
    </div>
  );
}

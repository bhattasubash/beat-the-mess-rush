import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Flame,
  Info,
  Scale,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealType, PortionSize } from '../../types';
import { BlurFade } from '../magicui/BlurFade';

export function StudentMenu() {
  const { state, selectedMessId, setPreCommit, setActiveStudentScreen } = useApp();
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Lunch');
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  const mess = state.messes[selectedMessId];
  const mealDishes = state.dishes.filter(
    (d) => d.messId === selectedMessId && d.meal === selectedMeal
  );

  const handleToggleEat = (dishId: string, currentWillEat: boolean, currentPortion: PortionSize) => {
    setPreCommit(dishId, !currentWillEat, currentPortion);
    triggerNotice();
  };

  const handleSelectPortion = (dishId: string, portion: PortionSize) => {
    setPreCommit(dishId, true, portion);
    triggerNotice();
  };

  const triggerNotice = () => {
    setShowSaveNotice(true);
    setTimeout(() => setShowSaveNotice(false), 2000);
  };

  // Count student's pre-commit stats
  let totalEating = 0;
  let smallCount = 0;
  let regularCount = 0;
  let largeCount = 0;
  let skippedCount = 0;

  mealDishes.forEach((d) => {
    const key = `${state.activeStudentId}_${d.id}`;
    const commit = state.studentPreCommits[key];
    const willEat = commit?.willEat ?? true;
    const portion = commit?.portion ?? 'Regular';

    if (willEat) {
      totalEating++;
      if (portion === 'Small') smallCount++;
      if (portion === 'Regular') regularCount++;
      if (portion === 'Large') largeCount++;
    } else {
      skippedCount++;
    }
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Scale className="size-3" /> Waste Prevention Planner
              </span>
              <span className="text-xs text-slate-400">
                {mess.name}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Today's Menu & Portion
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your meal preference and custom portion so the kitchen prepares exactly what you'll eat.
            </p>
          </div>

          {/* Meal Toggle (Lunch vs Dinner) */}
          <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-auto">
            {(['Lunch', 'Dinner'] as MealType[]).map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all ${
                  selectedMeal === meal
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Utensils className="size-3.5" />
                <span>{meal}</span>
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Plate Pre-commitment Summary Banner */}
      <BlurFade delay={0.1}>
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/20 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-blue-500" /> Your Dining Plan for {selectedMeal}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                You've planned {totalEating} dishes ({smallCount} Small, {regularCount} Regular, {largeCount} Large), and skipped {skippedCount}.
              </p>
            </div>
            <button
              onClick={() => setActiveStudentScreen('slots')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
            >
              Confirm in Slot Picker →
            </button>
          </div>
        </div>
      </BlurFade>

      {/* Floating Save Indicator */}
      {showSaveNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/90 text-white dark:bg-white dark:text-slate-900 px-4 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="size-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>Portion saved & synced with Kitchen Forecast!</span>
        </div>
      )}

      {/* Dish Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {mealDishes.map((dish, idx) => {
          const key = `${state.activeStudentId}_${dish.id}`;
          const commit = state.studentPreCommits[key];
          const willEat = commit?.willEat ?? true;
          const portion = commit?.portion ?? 'Regular';

          return (
            <BlurFade key={dish.id} delay={0.08 + idx * 0.03}>
              <div
                className={`rounded-2xl border transition-all p-4 ${
                  willEat
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
                    : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-100/60 dark:bg-slate-900/40 opacity-75'
                }`}
              >
                {/* Dish Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {dish.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          dish.diet === 'Veg'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : dish.diet === 'Non-Veg'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {dish.diet}
                      </span>
                      {dish.calories && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Flame className="size-3 text-amber-500" /> {dish.calories} kcal
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Standard serving: {dish.standardPortionGrams}g
                    </p>
                  </div>

                  {/* Eat vs Skip Toggle */}
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => handleToggleEat(dish.id, false, portion)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
                        willEat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Check className="size-3" />
                      <span>Eat</span>
                    </button>
                    <button
                      onClick={() => handleToggleEat(dish.id, true, portion)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
                        !willEat
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <X className="size-3" />
                      <span>Skip</span>
                    </button>
                  </div>
                </div>

                {/* Portion Selector (Only visible if student will eat) */}
                {willEat ? (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Choose Portion Size:
                      </span>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        {portion === 'Small'
                          ? `~${Math.round(dish.standardPortionGrams * 0.7)}g (Light / 70%)`
                          : portion === 'Large'
                          ? `~${Math.round(dish.standardPortionGrams * 1.3)}g (Hungry / 130%)`
                          : `~${dish.standardPortionGrams}g (Standard / 100%)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['Small', 'Regular', 'Large'] as PortionSize[]).map((p) => {
                        const isSelected = portion === p;
                        return (
                          <button
                            key={p}
                            onClick={() => handleSelectPortion(dish.id, p)}
                            className={`rounded-xl py-2 px-2 text-xs font-bold transition-all border text-center ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                            }`}
                          >
                            <div>{p}</div>
                            <div className="text-[10px] font-normal opacity-80 mt-0.5">
                              {p === 'Small' ? '0.7x' : p === 'Regular' ? '1.0x' : '1.3x'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="size-3.5 text-slate-400" />
                    <span>You marked this dish as skipped. 0g will be prepared for you.</span>
                  </div>
                )}
              </div>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
}

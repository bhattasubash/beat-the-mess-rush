import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Plus,
  Scale,
  Trash2,
  TrendingDown,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeftoverReason, MealType } from '../../types';

export function AdminWasteLog() {
  const { state, addWasteLog } = useApp();
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [formDate, setFormDate] = useState('Today');
  const [formMeal, setFormMeal] = useState<MealType>('Lunch');
  const [formDishName, setFormDishName] = useState('');
  const [formReturnedPlates, setFormReturnedPlates] = useState(320);
  const [formPlatesWithWaste, setFormPlatesWithWaste] = useState(45);
  const [formWasteWeightKg, setFormWasteWeightKg] = useState(6.5);
  const [formReason, setFormReason] = useState<LeftoverReason>('Portion too big');
  const [formLoggedBy, setFormLoggedBy] = useState('Supervisor Ramesh');
  const [logSuccessToast, setLogSuccessToast] = useState(false);

  const messId = state.adminSelectedMessId;
  const mess = state.messes[messId];

  // Waste logs for this mess
  const logs = state.wasteLogs.filter((w) => w.messId === messId);

  const totalWasteRecorded = logs.reduce((acc, l) => acc + l.wasteWeightKg, 0);
  const totalPlatesScraped = logs.reduce((acc, l) => acc + l.platesWithWaste, 0);
  const totalReturned = logs.reduce((acc, l) => acc + l.returnedPlates, 0);
  const avgWastePerPlateGrams = totalReturned > 0 ? Math.round((totalWasteRecorded / totalReturned) * 1000) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDishName.trim()) return;

    addWasteLog({
      date: formDate,
      messId,
      meal: formMeal,
      dishName: formDishName.trim(),
      returnedPlates: Number(formReturnedPlates),
      platesWithWaste: Number(formPlatesWithWaste),
      wasteWeightKg: Number(formWasteWeightKg),
      observedReason: formReason,
      loggedBy: formLoggedBy.trim() || 'Mess Supervisor',
    });

    setShowLogModal(false);
    setFormDishName('');
    setLogSuccessToast(true);
    setTimeout(() => setLogSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Dish Scrape & Leftover Monitoring</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {mess.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Plate Waste Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record returned trays, scrap weight, and leftover root causes at the dish-return counter.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="rounded-xl bg-blue-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-3.5" /> Log Returned Tray Data
        </button>
      </div>

      {logSuccessToast && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>Waste entry successfully logged into audit database!</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Total Recorded Waste
            </span>
            <Scale className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {totalWasteRecorded.toFixed(1)} kg
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {logs.length} recorded meal audits
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Plates with Waste
            </span>
            <Trash2 className="size-4 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400">
            {totalPlatesScraped}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            out of {totalReturned} total returned plates ({totalReturned > 0 ? Math.round((totalPlatesScraped / totalReturned) * 100) : 0}%)
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Average Scrape per Plate
            </span>
            <TrendingDown className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ~{avgWastePerPlateGrams}g
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Target is under 30g / plate!
          </div>
        </div>
      </div>

      {/* Log History Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Recorded Tray Audits & Scrap Weights
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by newest first
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Date & Meal</th>
                <th className="pb-3">Audited Dish</th>
                <th className="pb-3 font-mono">Returned Plates</th>
                <th className="pb-3 font-mono">Plates w/ Waste</th>
                <th className="pb-3 font-mono font-bold">Scrap Weight (kg)</th>
                <th className="pb-3">Primary Observed Cause</th>
                <th className="pb-3 text-right">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => {
                const wastePct = Math.round((log.platesWithWaste / log.returnedPlates) * 100);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>{log.date}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {log.meal}
                      </div>
                    </td>

                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {log.dishName}
                    </td>

                    <td className="py-3 font-mono text-slate-600 dark:text-slate-400">
                      {log.returnedPlates}
                    </td>

                    <td className="py-3 font-mono text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.platesWithWaste}</span>{' '}
                      <span className="text-[10px] text-slate-400">({wastePct}%)</span>
                    </td>

                    <td className="py-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {log.wasteWeightKg} kg
                    </td>

                    <td className="py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {log.observedReason}
                      </span>
                    </td>

                    <td className="py-3 text-right text-slate-500 font-mono text-[11px]">
                      {log.loggedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="size-5 text-blue-600" />
              Log Returned Plates & Leftover Weight
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <select
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="2 days ago">2 days ago</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Meal
                  </label>
                  <select
                    value={formMeal}
                    onChange={(e) => setFormMeal(e.target.value as MealType)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dish or Main Food Item
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steamed Rice & Dal Tadka"
                  value={formDishName}
                  onChange={(e) => setFormDishName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Total Plates
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formReturnedPlates}
                    onChange={(e) => setFormReturnedPlates(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Plates w/ Waste
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPlatesWithWaste}
                    onChange={(e) => setFormPlatesWithWaste(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formWasteWeightKg}
                    onChange={(e) => setFormWasteWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Observed Cause
                  </label>
                  <select
                    value={formReason}
                    onChange={(e) =>
                      setFormReason(e.target.value as LeftoverReason)
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Portion too big">Portion too big</option>
                    <option value="Taste">Taste</option>
                    <option value="Too cold">Too cold</option>
                    <option value="No time">No time</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Audited By
                  </label>
                  <input
                    type="text"
                    value={formLoggedBy}
                    onChange={(e) => setFormLoggedBy(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  PieChart,
  Scale,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminReports() {
  const { state } = useApp();
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const mess = state.messes[state.adminSelectedMessId];
  const history = state.historicalStats;

  // Most wasted dishes data
  const mostWastedDishes = [
    { name: 'Steamed Basmati Rice', wasteKg: 42.5, percent: 34, primaryReason: 'Portion too big' },
    { name: 'Plain Yellow Dal Tadka', wasteKg: 28.0, percent: 22, primaryReason: 'Taste' },
    { name: 'Butter Phulka Roti', wasteKg: 19.4, percent: 16, primaryReason: 'No time' },
    { name: 'Kadhai Veg / Mixed Curry', wasteKg: 18.2, percent: 14, primaryReason: 'Too cold' },
    { name: 'Salad & Curd', wasteKg: 17.0, percent: 14, primaryReason: 'Portion too big' },
  ];

  // Feedback reasons breakdown count
  const feedbackReasonCounts = {
    'Portion too big': 42,
    'Taste': 28,
    'Too cold': 16,
    'No time': 10,
    'Other': 4,
  };
  const totalReasons = Object.values(feedbackReasonCounts).reduce((a, b) => a + b, 0);

  // Peak times 15-minute slot curve
  const peakTimeSlots = [
    { slot: '12:00', diners: 42 },
    { slot: '12:15', diners: 88 },
    { slot: '12:30', diners: 140 }, // Peak
    { slot: '12:45', diners: 135 },
    { slot: '13:00', diners: 95 },
    { slot: '13:15', diners: 54 },
    { slot: '13:30', diners: 32 },
    { slot: '13:45', diners: 18 },
  ];
  const maxSlotDiners = Math.max(...peakTimeSlots.map((s) => s.diners));

  // CSV Exporter for Historical Data
  const exportHistoryCSV = () => {
    const headers = [
      'Day',
      'Date',
      'Lunch Diners',
      'Dinner Diners',
      'Total Diners',
      'Plate Waste (kg)',
      'Avg Wait Time (mins)',
      'Clean Plates (%)',
      'Top Wasted Dish',
      'Top Leftover Reason',
    ];

    const rows = history.map((h) => [
      h.date,
      h.dayLabel,
      h.lunchDiners,
      h.dinnerDiners,
      h.lunchDiners + h.dinnerDiners,
      h.totalWasteKg,
      h.avgWaitMins,
      `${h.cleanPlatesPercent}%`,
      `"${h.topWastedDish}"`,
      `"${h.topReason}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mess_analytics_7days_${mess.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessToast('7-Day Analytics CSV downloaded successfully!');
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  // CSV Exporter for Waste Logs
  const exportWasteLogsCSV = () => {
    const headers = [
      'Log ID',
      'Date',
      'Mess Hall',
      'Meal',
      'Dish Name',
      'Returned Plates',
      'Plates w/ Waste',
      'Waste Weight (kg)',
      'Observed Reason',
      'Auditor',
    ];

    const rows = state.wasteLogs.map((l) => [
      l.id,
      l.date,
      l.messId,
      l.meal,
      `"${l.dishName}"`,
      l.returnedPlates,
      l.platesWithWaste,
      l.wasteWeightKg,
      `"${l.observedReason}"`,
      `"${l.loggedBy}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waste_audit_logs_${mess.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessToast('Waste Logs CSV downloaded successfully!');
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Executive Insights & Trends</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {mess.name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            7-day historical trends for queue wait times, plate waste reduction, and student feedback causes.
          </p>
        </div>

        {/* CSV Export Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportHistoryCSV}
            className="rounded-xl bg-blue-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Download className="size-3.5" /> Export 7-Day CSV
          </button>
          <button
            onClick={exportWasteLogsCSV}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-600" /> Export Waste Logs
          </button>
        </div>
      </div>

      {downloadSuccessToast && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* 2 Column Trend Charts: Wait Time Trend & Waste Trend over 7 Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: 7-Day Waste Trend (kg) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="size-4 text-emerald-600" />
                Waste Reduction Trend (kg / day)
              </h3>
              <p className="text-[11px] text-slate-400">
                Down from 38.5 kg to 17.8 kg (-53.7% drop)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              -53.7% Drop
            </span>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
            {history.map((day) => {
              const maxWaste = 45;
              const heightPct = Math.round((day.totalWasteKg / maxWaste) * 100);
              const isToday = day.date === 'Today';

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">
                    {day.totalWasteKg}k
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        isToday ? 'bg-emerald-500' : 'bg-emerald-400/80 group-hover:bg-emerald-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 truncate max-w-[40px]">
                    {day.dayLabel.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: 7-Day Average Wait Time (mins) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="size-4 text-blue-600" />
                Average Wait Time Trend (mins)
              </h3>
              <p className="text-[11px] text-slate-400">
                Down from 11.2 min peak to 5.1 min today
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
              -54.4% Wait
            </span>
          </div>

          {/* Clean SVG Line / Bar Representation */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
            {history.map((day) => {
              const maxWait = 15;
              const heightPct = Math.round((day.avgWaitMins / maxWait) * 100);
              const isToday = day.date === 'Today';

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">
                    {day.avgWaitMins}m
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        isToday ? 'bg-blue-600' : 'bg-blue-400/80 group-hover:bg-blue-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 truncate max-w-[40px]">
                    {day.dayLabel.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Peak Times & Most-Wasted Dishes & Feedback Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Peak Times Curve */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Lunch Rush Hour Arrival Curve
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Clear peak at 12:30–12:45. Slot picker smooths this by 40%.
          </p>

          <div className="space-y-2">
            {peakTimeSlots.map((pt) => {
              const pct = Math.round((pt.diners / maxSlotDiners) * 100);
              const isPeak = pt.diners === maxSlotDiners;
              return (
                <div key={pt.slot} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {pt.slot} {isPeak && <span className="text-rose-500 font-bold">(Peak)</span>}
                    </span>
                    <span className="font-mono text-slate-500">{pt.diners} students</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPeak ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most-Wasted Dishes Ranking */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Most-Wasted Dishes (7-Day Total)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Items requiring recipe or standard portion adjustment.
          </p>

          <div className="space-y-3 text-xs">
            {mostWastedDishes.map((dish, i) => (
              <div key={dish.name} className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {i + 1}. {dish.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Primary cause: <span className="font-semibold text-amber-600">{dish.primaryReason}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    {dish.wasteKg} kg
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {dish.percent}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Reasons Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Student Leftover Reasons
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Aggregated feedback reported directly by students.
          </p>

          <div className="space-y-2.5 text-xs">
            {Object.entries(feedbackReasonCounts).map(([reason, count]) => {
              const pct = Math.round((count / totalReasons) * 100);
              return (
                <div key={reason} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {reason}
                    </span>
                    <span className="font-mono text-slate-500">
                      {count} votes ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        reason === 'Portion too big'
                          ? 'bg-blue-600'
                          : reason === 'Taste'
                          ? 'bg-amber-500'
                          : reason === 'Too cold'
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  BarChart3,
  CalendarCheck,
  ChefHat,
  ChevronRight,
  ClipboardList,
  Clock,
  LayoutDashboard,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppState, MessId } from '../../types';

export function AdminSidebar() {
  const { state, setActiveAdminScreen, setAdminSelectedMessId } = useApp();

  const navItems: {
    id: AppState['activeAdminScreen'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Demand Forecast', icon: ClipboardList, badge: 'Kitchen' },
    { id: 'menu', label: 'Menu Management', icon: ChefHat },
    { id: 'queue', label: 'Queue & Capacity Control', icon: Clock, badge: 'Live' },
    { id: 'waste', label: 'Plate Waste Log', icon: Trash2 },
    { id: 'reports', label: 'Analytics & CSV Reports', icon: BarChart3 },
  ];

  const mess = state.messes[state.adminSelectedMessId];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-5">
        {/* Mess Selector for Admin Scope */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Active Mess Scope
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {(['north', 'south', 'central'] as MessId[]).map((mId) => {
              const isSelected = state.adminSelectedMessId === mId;
              return (
                <button
                  key={mId}
                  onClick={() => setAdminSelectedMessId(mId)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mId === 'north' ? 'North' : mId === 'south' ? 'South' : 'Central'}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            {mess?.name} ({mess?.hostelLabel})
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeAdminScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`size-4 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.badge === 'Live'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile Info */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
            VR
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              Vikram Rao
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Chief Mess Manager
            </div>
          </div>
          <span className="size-2 rounded-full bg-emerald-500" title="Online" />
        </div>
      </div>
    </aside>
  );
}

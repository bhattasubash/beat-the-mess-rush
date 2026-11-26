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
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Demand Forecast', icon: ClipboardList },
    { id: 'menu', label: 'Menu Management', icon: ChefHat },
    { id: 'queue', label: 'Queue & Capacity', icon: Clock },
    { id: 'waste', label: 'Plate Waste Log', icon: Trash2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const mess = state.messes[state.adminSelectedMessId];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-5">
        {/* Mess Selector for Admin Scope */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1.5">
            Mess Scope
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
            {(['north', 'south', 'central'] as MessId[]).map((mId) => {
              const isSelected = state.adminSelectedMessId === mId;
              return (
                <button
                  key={mId}
                  onClick={() => setAdminSelectedMessId(mId)}
                  className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {mId === 'north' ? 'North' : mId === 'south' ? 'South' : 'Central'}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 truncate">
            {mess?.name}
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`size-4 ${
                    isActive ? 'text-blue-700 dark:text-blue-400' : 'text-neutral-400'
                  }`}
                />
                <span>{item.label}</span>
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

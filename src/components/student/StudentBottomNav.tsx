import {
  CalendarCheck,
  History,
  Home,
  MessageSquare,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppState } from '../../types';

export function StudentBottomNav({ inPhoneFrame = false }: { inPhoneFrame?: boolean }) {
  const { state, setActiveStudentScreen } = useApp();

  const navItems: {
    id: AppState['activeStudentScreen'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'slots', label: 'Slots', icon: CalendarCheck },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className={`${
        inPhoneFrame
          ? 'sticky bottom-0 w-full'
          : 'md:hidden fixed bottom-0 inset-x-0 z-40'
      } bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5`}
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeStudentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStudentScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

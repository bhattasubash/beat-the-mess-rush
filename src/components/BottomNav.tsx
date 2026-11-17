import { Clock, Gauge, MessageSquare, Vote } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const NAV_ITEMS: {
  id: ScreenId;
  label: string;
  icon: typeof Gauge;
}[] = [
  { id: 'now', label: 'Now', icon: Gauge },
  { id: 'best-time', label: 'Best Time', icon: Clock },
  { id: 'menu-vote', label: 'Menu Vote', icon: Vote },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
];

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="border-t-2 border-[#D1D5DB] bg-white px-2 py-1.5 grid grid-cols-4 gap-1 shrink-0"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
              isActive
                ? 'bg-[#F3F4F6] border border-[#D1D5DB] text-[#111827]'
                : 'text-[#4B5563] border border-transparent hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.25 : 1.75} />
            <span
              className={`text-[12px] mt-0.5 leading-tight ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

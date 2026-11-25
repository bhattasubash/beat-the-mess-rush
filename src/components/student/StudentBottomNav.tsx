import {
  CalendarCheck,
  History,
  Home,
  MessageSquare,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppState } from '../../types';
import { Dock, DockIcon } from '../magicui/Dock';

export function StudentBottomNav() {
  const { state, setActiveStudentScreen } = useApp();

  const navItems: {
    id: AppState['activeStudentScreen'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'slots', label: 'Slots', icon: CalendarCheck },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto">
        <Dock iconSize={42} iconMagnification={52} iconDistance={90}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeStudentScreen === item.id;
            return (
              <DockIcon
                key={item.id}
                active={isActive}
                onClick={() => setActiveStudentScreen(item.id)}
                className="group flex flex-col items-center justify-center"
              >
                <Icon className="size-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">{item.label}</span>
              </DockIcon>
            );
          })}
        </Dock>
      </div>
    </div>
  );
}

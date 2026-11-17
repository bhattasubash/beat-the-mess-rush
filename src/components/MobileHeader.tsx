import { ScreenId } from '../types';

interface MobileHeaderProps {
  currentScreen: ScreenId;
}

const STEP_META: Record<
  ScreenId,
  { step: string; label: string; flow: string }
> = {
  setup: {
    step: 'Step 1 of 6',
    label: 'Onboarding',
    flow: 'Flow: 1 → 2',
  },
  now: {
    step: 'Step 2 of 6',
    label: 'Live Status',
    flow: 'Flow: 1 → 2 → 3',
  },
  'best-time': {
    step: 'Step 3 of 6',
    label: 'Planning',
    flow: 'Flow: 2 → 3 → 4',
  },
  reminder: {
    step: 'Step 4 of 6',
    label: 'Confirmation',
    flow: 'Flow: 3 → 4 → 5',
  },
  'menu-vote': {
    step: 'Step 5 of 6',
    label: 'Meal Planning',
    flow: 'Flow: 4 → 5 → 6',
  },
  feedback: {
    step: 'Step 6 of 6',
    label: 'Quick Review',
    flow: 'Flow: Complete',
  },
};

export function MobileHeader({ currentScreen }: MobileHeaderProps) {
  const meta = STEP_META[currentScreen];

  return (
    <header className="border-b border-[#D1D5DB] px-5 py-3 bg-[#F3F4F6] shrink-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 bg-[#D1D5DB] text-[#111827] text-[11px] font-semibold uppercase tracking-wider rounded whitespace-nowrap shrink-0 tabular-nums">
            {meta.step}
          </span>
          <span className="text-[#6B7280] text-[13px] font-medium truncate">
            {meta.label}
          </span>
        </div>
        <span className="text-[#2563EB] text-[13px] font-semibold whitespace-nowrap shrink-0 tabular-nums">
          {meta.flow}
        </span>
      </div>
    </header>
  );
}

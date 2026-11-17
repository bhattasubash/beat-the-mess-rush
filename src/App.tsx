import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DesktopCompanion } from './components/DesktopCompanion';
import { MobileHeader } from './components/MobileHeader';
import { BestTimeScreen } from './components/screens/BestTimeScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { MenuVoteScreen } from './components/screens/MenuVoteScreen';
import { NowScreen } from './components/screens/NowScreen';
import { ReminderSetScreen } from './components/screens/ReminderSetScreen';
import { SetupScreen } from './components/screens/SetupScreen';
import {
  FEEDBACK_OPTIONS,
  getCalmTimeSlots,
  MESS_HALLS,
} from './data/messData';
import {
  CrowdLevel,
  DishChoice,
  FeedbackEntry,
  FeedbackIssueId,
  MealType,
  MessId,
  ReminderInfo,
  ScreenId,
  TimeSlot,
} from './types';

interface PersistedState {
  currentScreen: ScreenId;
  selectedMessId: MessId;
  breakTime: string;
  meal: MealType;
  crowdByMess: Record<MessId, CrowdLevel>;
  activeReminder: ReminderInfo | null;
  votes: Record<string, DishChoice>;
  voteSubmittedAt: string | null;
  feedbackLog: FeedbackEntry[];
}

const STORAGE_KEY = 'mess_meter_state_v1';

const DEFAULT_CROWD_BY_MESS: Record<MessId, CrowdLevel> = {
  'hostel-7': 'Busy',
  'hostel-3': 'Calm',
  'hostel-12': 'Packed',
  central: 'Busy',
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        currentScreen: parsed.currentScreen ?? 'setup',
        selectedMessId: parsed.selectedMessId ?? 'hostel-7',
        breakTime: parsed.breakTime ?? '12:30',
        meal: parsed.meal ?? 'Lunch',
        crowdByMess: {
          ...DEFAULT_CROWD_BY_MESS,
          ...(parsed.crowdByMess ?? {}),
        },
        activeReminder: parsed.activeReminder ?? null,
        votes: parsed.votes ?? {},
        voteSubmittedAt: parsed.voteSubmittedAt ?? null,
        feedbackLog: Array.isArray(parsed.feedbackLog) ? parsed.feedbackLog : [],
      };
    }
  } catch {
    // Fallback to clean defaults if storage is unavailable
  }

  return {
    currentScreen: 'setup',
    selectedMessId: 'hostel-7',
    breakTime: '12:30',
    meal: 'Lunch',
    crowdByMess: DEFAULT_CROWD_BY_MESS,
    activeReminder: null,
    votes: {},
    voteSubmittedAt: null,
    feedbackLog: [],
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [lastUpdatedLabel, setLastUpdatedLabel] =
    useState<string>('Updated 2 min ago');
  const [lastFeedbackMessage, setLastFeedbackMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const activeMess =
    MESS_HALLS.find((m) => m.id === state.selectedMessId) ?? MESS_HALLS[0];

  const activeCrowd = state.crowdByMess[activeMess.id];

  const defaultSlot = getCalmTimeSlots(
    state.breakTime,
    state.meal,
    activeMess.id
  )[0];

  const reminderToDisplay: ReminderInfo = state.activeReminder ?? {
    slotId: defaultSlot.id,
    messId: activeMess.id,
    slotRange: `${defaultSlot.start} - ${defaultSlot.end}`,
    slotLevel: defaultSlot.level,
    alertTime: defaultSlot.reminderTime,
    meal: state.meal,
  };

  const handleNavigate = (screen: ScreenId) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
  };

  const handleSaveSetup = (messId: MessId, breakTime: string) => {
    setState((prev) => ({
      ...prev,
      selectedMessId: messId,
      breakTime,
      currentScreen: 'now',
    }));
  };

  const handleSelectCrowd = (level: CrowdLevel) => {
    setState((prev) => ({
      ...prev,
      crowdByMess: {
        ...prev.crowdByMess,
        [prev.selectedMessId]: level,
      },
    }));
    setLastUpdatedLabel('Updated just now');
  };

  const handleRefreshNow = () => {
    setLastUpdatedLabel('Updated just now');
  };

  const handleRemindMe = (slot: TimeSlot) => {
    const newReminder: ReminderInfo = {
      slotId: slot.id,
      messId: state.selectedMessId,
      slotRange: `${slot.start} - ${slot.end}`,
      slotLevel: slot.level,
      alertTime: slot.reminderTime,
      meal: state.meal,
    };
    setState((prev) => ({
      ...prev,
      activeReminder: newReminder,
      currentScreen: 'reminder',
    }));
  };

  const handleToggleVote = (dishId: string, choice: DishChoice) => {
    setState((prev) => ({
      ...prev,
      votes: {
        ...prev.votes,
        [dishId]: choice,
      },
    }));
  };

  const handleSubmitVote = () => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setState((prev) => ({
      ...prev,
      voteSubmittedAt: nowTime,
      currentScreen: 'feedback',
    }));
  };

  const handleSendFeedback = (issueId: FeedbackIssueId, note: string) => {
    const issue = FEEDBACK_OPTIONS.find((opt) => opt.id === issueId);
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const entry: FeedbackEntry = {
      id: `${Date.now()}`,
      messId: state.selectedMessId,
      issueId,
      issueTitle: issue?.title ?? 'Feedback',
      note,
      timestamp: nowTime,
    };

    setState((prev) => ({
      ...prev,
      feedbackLog: [entry, ...prev.feedbackLog],
    }));
    setLastFeedbackMessage('Thanks, sent to the mess team');
  };

  const showBottomNav =
    state.currentScreen === 'now' ||
    state.currentScreen === 'best-time' ||
    state.currentScreen === 'menu-vote' ||
    state.currentScreen === 'feedback';

  return (
    <div className="min-h-dvh bg-[#F9FAFB] text-[#111827] lg:py-8 lg:px-8">
      <div className="max-w-6xl mx-auto lg:flex lg:items-start lg:gap-8">
        {/* Mobile App Frame (exact 390px wireframe proportions on desktop, full width on mobile) */}
        <div className="w-full max-w-[430px] lg:w-[390px] lg:max-w-[390px] mx-auto lg:mx-0 min-h-dvh lg:min-h-[820px] flex flex-col justify-between bg-white border-x border-[#D1D5DB] lg:border lg:rounded-2xl lg:overflow-hidden shadow-sm shrink-0">
          <MobileHeader currentScreen={state.currentScreen} />

          {state.currentScreen === 'setup' && (
            <SetupScreen
              selectedMessId={state.selectedMessId}
              breakTime={state.breakTime}
              onSaveSetup={handleSaveSetup}
            />
          )}

          {state.currentScreen === 'now' && (
            <NowScreen
              mess={activeMess}
              crowdLevel={activeCrowd}
              breakTime={state.breakTime}
              lastUpdatedLabel={lastUpdatedLabel}
              onChangeMess={() => handleNavigate('setup')}
              onSelectCrowd={handleSelectCrowd}
              onRefresh={handleRefreshNow}
              onSeeBestTime={() => handleNavigate('best-time')}
            />
          )}

          {state.currentScreen === 'best-time' && (
            <BestTimeScreen
              mess={activeMess}
              breakTime={state.breakTime}
              meal={state.meal}
              activeReminder={state.activeReminder}
              onChangeMeal={(meal) => setState((prev) => ({ ...prev, meal }))}
              onBackToNow={() => handleNavigate('now')}
              onRemindMe={handleRemindMe}
            />
          )}

          {state.currentScreen === 'reminder' && (
            <ReminderSetScreen
              mess={activeMess}
              reminder={reminderToDisplay}
              onVoteDishes={() => handleNavigate('menu-vote')}
              onBackToNow={() => handleNavigate('now')}
            />
          )}

          {state.currentScreen === 'menu-vote' && (
            <MenuVoteScreen
              mess={activeMess}
              meal={state.meal}
              votes={state.votes}
              lastSubmittedAt={state.voteSubmittedAt}
              onToggleVote={handleToggleVote}
              onSubmitVote={handleSubmitVote}
            />
          )}

          {state.currentScreen === 'feedback' && (
            <FeedbackScreen
              mess={activeMess}
              meal={state.meal}
              lastSentMessage={lastFeedbackMessage}
              onSendFeedback={handleSendFeedback}
              onReturnToNow={() => handleNavigate('now')}
            />
          )}

          {showBottomNav && (
            <BottomNav
              currentScreen={state.currentScreen}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {/* Desktop Companion Panel */}
        <DesktopCompanion
          currentScreen={state.currentScreen}
          selectedMessId={state.selectedMessId}
          breakTime={state.breakTime}
          meal={state.meal}
          crowdByMess={state.crowdByMess}
          activeReminder={state.activeReminder}
          votes={state.votes}
          voteSubmittedAt={state.voteSubmittedAt}
          feedbackLog={state.feedbackLog}
          onNavigate={handleNavigate}
          onSelectMess={(messId) =>
            setState((prev) => ({ ...prev, selectedMessId: messId }))
          }
        />
      </div>
    </div>
  );
}

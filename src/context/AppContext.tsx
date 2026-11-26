import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AppState,
  CrowdLevel,
  DishItem,
  FeedbackRecord,
  LeftoverAmount,
  LeftoverReason,
  MealType,
  MessId,
  MessNotice,
  PortionSize,
  Role,
  SlotBooking,
  StudentProfile,
  WasteLogEntry,
} from '../types';
import { getInitialAppState } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'mess_meter_state_v1';

export interface AppContextType {
  state: AppState;
  activeStudent: StudentProfile;
  selectedMessId: MessId;
  adminSelectedMessId: MessId;
  // Navigation & Role
  setRole: (role: Role) => void;
  setActiveStudentId: (studentId: string) => void;
  setSelectedMessId: (messId: MessId) => void;
  setAdminSelectedMessId: (messId: MessId) => void;
  setActiveStudentScreen: (screen: AppState['activeStudentScreen']) => void;
  setActiveAdminScreen: (screen: AppState['activeAdminScreen']) => void;
  toggleDarkMode: () => void;
  toggleMobilePreview: () => void;
  resetDemoData: () => void;

  // Calculators
  calculateWaitTime: (messId: MessId) => number;
  calculateCrowdLevel: (messId: MessId) => {
    level: CrowdLevel;
    label: 'Calm' | 'Busy' | 'Packed';
    dotClass: string;
    waitMinutes: number;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  };

  // Student Actions
  registerStudent: (profile: Omit<StudentProfile, 'id'>) => Promise<StudentProfile>;
  toggleReminder: (messId: MessId) => void;
  setPreCommit: (dishId: string, willEat: boolean, portion: PortionSize) => void;
  bookSlot: (slotId: string) => { success: boolean; message: string; booking?: SlotBooking };
  cancelBooking: (bookingId: string) => void;
  submitFeedback: (feedback: {
    messId: MessId;
    meal: MealType;
    dishRatings: Record<string, number>;
    leftoverAmount: LeftoverAmount;
    leftoverReason?: LeftoverReason;
    comments?: string;
  }) => void;

  // Admin Actions
  updateQueueCount: (messId: MessId, count: number) => void;
  toggleCounter: (messId: MessId, openCount: number) => void;
  updateServiceRate: (messId: MessId, rate: number) => void;
  updateSlotCapacity: (messId: MessId, capacity: number) => void;
  broadcastNotice: (title: string, message: string, type: MessNotice['type'], messId?: MessId | 'all') => void;
  addDish: (dish: Omit<DishItem, 'id'>) => void;
  editDish: (dish: DishItem) => void;
  removeDish: (dishId: string) => void;
  addWasteLog: (entry: Omit<WasteLogEntry, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppState>;
        return { ...getInitialAppState(), ...parsed };
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return getInitialAppState();
  });

  const hydratedFromApi = useRef(false);

  // Hydrate from backend API on mount
  useEffect(() => {
    let active = true;
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverState: AppState | null) => {
        if (!active) return;
        if (serverState && serverState.messes) {
          setState((prev) => ({
            ...prev,
            ...serverState,
            currentRole: prev.currentRole,
            activeStudentScreen: prev.activeStudentScreen,
            activeAdminScreen: prev.activeAdminScreen,
            isDarkMode: prev.isDarkMode,
            mobilePreviewMode: prev.mobilePreviewMode,
          }));
        }
        hydratedFromApi.current = true;
      })
      .catch(() => {
        hydratedFromApi.current = true;
      });
    return () => {
      active = false;
    };
  }, []);

  // Save to localStorage and sync to backend API whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event('mess_rush_state_updated'));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    if (!hydratedFromApi.current) return;
    fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(() => {});
  }, [state]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Current active student profile
  const activeStudent =
    state.students.find((s) => s.id === state.activeStudentId) ||
    state.students[0] ||
    getInitialAppState().students[0];

  // Navigation handlers
  const setRole = (role: Role) => setState((prev) => ({ ...prev, currentRole: role }));
  const setActiveStudentId = (studentId: string) =>
    setState((prev) => ({ ...prev, activeStudentId: studentId }));
  const setSelectedMessId = (messId: MessId) =>
    setState((prev) => ({ ...prev, selectedMessId: messId }));
  const setAdminSelectedMessId = (messId: MessId) =>
    setState((prev) => ({ ...prev, adminSelectedMessId: messId }));
  const setActiveStudentScreen = (screen: AppState['activeStudentScreen']) =>
    setState((prev) => ({ ...prev, activeStudentScreen: screen }));
  const setActiveAdminScreen = (screen: AppState['activeAdminScreen']) =>
    setState((prev) => ({ ...prev, activeAdminScreen: screen }));
  const toggleDarkMode = () =>
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  const toggleMobilePreview = () =>
    setState((prev) => ({ ...prev, mobilePreviewMode: !prev.mobilePreviewMode }));
  const resetDemoData = () => {
    const initial = getInitialAppState();
    setState(initial);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    } catch {}
    fetch('/api/reset', { method: 'POST' }).catch(() => {});
  };

  // Logic: Calculate Estimated Wait Time in minutes
  // Formula: Estimated wait = people in queue / (open counters * service rate per counter per min)
  const calculateWaitTime = (messId: MessId): number => {
    const mess = state.messes[messId];
    if (!mess) return 0;
    if (mess.openCounters <= 0) return 0;
    const effectiveSpeed = mess.openCounters * mess.serviceRate;
    if (effectiveSpeed <= 0) return 0;
    const wait = mess.queueCount / effectiveSpeed;
    return Math.round(wait * 10) / 10; // 1 decimal place
  };

  // Logic: Crowd Level:
  // Low: under 5 min (Green)
  // Medium: 5 to 10 min (Amber)
  // High: over 10 min (Red)
  const calculateCrowdLevel = (messId: MessId) => {
    const wait = calculateWaitTime(messId);
    let level: CrowdLevel = 'Low';
    let label: 'Calm' | 'Busy' | 'Packed' = 'Calm';
    let dotClass = 'bg-emerald-600';
    let colorClass = 'text-emerald-700 dark:text-emerald-400';
    let bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    let borderClass = 'border-emerald-600';

    if (wait >= 10) {
      level = 'High';
      label = 'Packed';
      dotClass = 'bg-red-600';
      colorClass = 'text-red-700 dark:text-red-400';
      bgClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
      borderClass = 'border-red-600';
    } else if (wait >= 5) {
      level = 'Medium';
      label = 'Busy';
      dotClass = 'bg-amber-500';
      colorClass = 'text-amber-700 dark:text-amber-400';
      bgClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      borderClass = 'border-amber-500';
    }

    return {
      level,
      label,
      dotClass,
      waitMinutes: wait,
      colorClass,
      bgClass,
      borderClass,
    };
  };

  // Student: Register or Sign In
  const registerStudent = async (
    profile: Omit<StudentProfile, 'id'>
  ): Promise<StudentProfile> => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          student: StudentProfile;
          students: StudentProfile[];
        };
        setState((prev) => ({
          ...prev,
          students: data.students,
          activeStudentId: data.student.id,
          selectedMessId: data.student.preferredMessId,
          currentRole: 'student',
        }));
        return data.student;
      }
    } catch {}

    const normalizedRoll = profile.rollNumber.trim().toUpperCase();
    const existing = state.students.find(
      (s) => s.rollNumber.toUpperCase() === normalizedRoll
    );
    if (existing) {
      setState((prev) => ({
        ...prev,
        activeStudentId: existing.id,
        selectedMessId: existing.preferredMessId,
        currentRole: 'student',
      }));
      return existing;
    }

    const newStudent: StudentProfile = {
      ...profile,
      id: `s-${Date.now()}`,
      rollNumber: normalizedRoll,
    };
    setState((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
      activeStudentId: newStudent.id,
      selectedMessId: newStudent.preferredMessId,
      currentRole: 'student',
    }));
    return newStudent;
  };

  // Student: Toggle reminder for a mess
  const toggleReminder = (messId: MessId) => {
    setState((prev) => {
      const key = `${prev.activeStudentId}_${messId}`;
      const next = !prev.reminders[key];
      return {
        ...prev,
        reminders: {
          ...prev.reminders,
          [key]: next,
        },
      };
    });
  };

  // Student: Pre-commit to a dish portion
  const setPreCommit = (dishId: string, willEat: boolean, portion: PortionSize) => {
    setState((prev) => {
      const key = `${prev.activeStudentId}_${dishId}`;
      return {
        ...prev,
        studentPreCommits: {
          ...prev.studentPreCommits,
          [key]: { dishId, willEat, portion },
        },
      };
    });
  };

  // Student: Book a Slot
  // Rule: 1 slot per meal (Lunch & Dinner), full slot cannot be booked!
  const bookSlot = (slotId: string): { success: boolean; message: string; booking?: SlotBooking } => {
    const targetSlot = state.slots.find((s) => s.id === slotId);
    if (!targetSlot) {
      return { success: false, message: 'Slot not found.' };
    }

    // Check capacity
    if (targetSlot.bookedCount >= targetSlot.capacity) {
      return { success: false, message: 'This slot is completely full. Please choose another time.' };
    }

    // Check if student already has a booking for this meal today
    const existing = state.studentBookings.find(
      (b) =>
        b.studentId === state.activeStudentId &&
        b.meal === targetSlot.meal &&
        b.status === 'Confirmed'
    );

    // If changing slot, we free up previous slot
    const updatedSlots = state.slots.map((s) => {
      if (existing && s.id === existing.slotId) {
        return { ...s, bookedCount: Math.max(0, s.bookedCount - 1) };
      }
      if (s.id === slotId) {
        return { ...s, bookedCount: s.bookedCount + 1 };
      }
      return s;
    });

    // Gather student's dish pre-commits for this meal
    const mealDishes = state.dishes.filter(
      (d) => d.messId === targetSlot.messId && d.meal === targetSlot.meal
    );
    const portionsRecord: Record<string, { willEat: boolean; portion: PortionSize }> = {};
    mealDishes.forEach((d) => {
      const key = `${state.activeStudentId}_${d.id}`;
      const commit = state.studentPreCommits[key];
      portionsRecord[d.id] = commit || { willEat: true, portion: 'Regular' };
    });

    const newBooking: SlotBooking = {
      id: `b-${Date.now()}`,
      bookingCode: `BMR-${targetSlot.messId.toUpperCase()[0]}-${targetSlot.meal[0]}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: state.activeStudentId,
      studentName: activeStudent.name,
      rollNumber: activeStudent.rollNumber,
      messId: targetSlot.messId,
      meal: targetSlot.meal,
      slotId: targetSlot.id,
      startTime: targetSlot.startTime,
      endTime: targetSlot.endTime,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed',
      portions: portionsRecord,
    };

    const filteredBookings = state.studentBookings.filter(
      (b) => !(b.studentId === state.activeStudentId && b.meal === targetSlot.meal && b.status === 'Confirmed')
    );

    setState((prev) => ({
      ...prev,
      slots: updatedSlots,
      studentBookings: [newBooking, ...filteredBookings],
    }));

    return {
      success: true,
      message: existing ? 'Slot updated successfully!' : 'Slot booked successfully!',
      booking: newBooking,
    };
  };

  // Student: Cancel Booking
  const cancelBooking = (bookingId: string) => {
    setState((prev) => {
      const target = prev.studentBookings.find((b) => b.id === bookingId);
      if (!target) return prev;

      const updatedSlots = prev.slots.map((s) => {
        if (s.id === target.slotId) {
          return { ...s, bookedCount: Math.max(0, s.bookedCount - 1) };
        }
        return s;
      });

      const updatedBookings = prev.studentBookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
      );

      return {
        ...prev,
        slots: updatedSlots,
        studentBookings: updatedBookings,
      };
    });
  };

  // Student: Submit Feedback
  const submitFeedback = (fb: {
    messId: MessId;
    meal: MealType;
    dishRatings: Record<string, number>;
    leftoverAmount: LeftoverAmount;
    leftoverReason?: LeftoverReason;
    comments?: string;
  }) => {
    const newRecord: FeedbackRecord = {
      id: `f-${Date.now()}`,
      studentId: state.activeStudentId,
      studentName: activeStudent.name,
      messId: fb.messId,
      meal: fb.meal,
      date: 'Today',
      timestamp: 'Just now',
      dishRatings: fb.dishRatings,
      leftoverAmount: fb.leftoverAmount,
      leftoverReason: fb.leftoverReason,
      comments: fb.comments,
    };

    setState((prev) => ({
      ...prev,
      feedbacks: [newRecord, ...prev.feedbacks],
    }));
  };

  // Admin: Update Queue Count
  const updateQueueCount = (messId: MessId, count: number) => {
    const safeCount = Math.max(0, count);
    setState((prev) => ({
      ...prev,
      messes: {
        ...prev.messes,
        [messId]: {
          ...prev.messes[messId],
          queueCount: safeCount,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  };

  // Admin: Toggle or Set Open Counters
  const toggleCounter = (messId: MessId, openCount: number) => {
    const mess = state.messes[messId];
    const safeCount = Math.min(mess.totalCounters, Math.max(0, openCount));
    setState((prev) => ({
      ...prev,
      messes: {
        ...prev.messes,
        [messId]: {
          ...prev.messes[messId],
          openCounters: safeCount,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  };

  // Admin: Update Service Rate
  const updateServiceRate = (messId: MessId, rate: number) => {
    const safeRate = Math.max(0.5, Math.min(5.0, Math.round(rate * 10) / 10));
    setState((prev) => ({
      ...prev,
      messes: {
        ...prev.messes,
        [messId]: {
          ...prev.messes[messId],
          serviceRate: safeRate,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  };

  // Admin: Set Slot Capacity
  const updateSlotCapacity = (messId: MessId, capacity: number) => {
    const safeCap = Math.max(10, capacity);
    setState((prev) => {
      const updatedSlots = prev.slots.map((s) => {
        if (s.messId === messId) {
          return { ...s, capacity: safeCap };
        }
        return s;
      });
      return {
        ...prev,
        messes: {
          ...prev.messes,
          [messId]: {
            ...prev.messes[messId],
            slotCapacity: safeCap,
          },
        },
        slots: updatedSlots,
      };
    });
  };

  // Admin: Broadcast Notice
  const broadcastNotice = (
    title: string,
    message: string,
    type: MessNotice['type'],
    messId: MessId | 'all' = 'all'
  ) => {
    const newNotice: MessNotice = {
      id: `n-${Date.now()}`,
      messId,
      title,
      message,
      timestamp: 'Just now',
      type,
    };
    setState((prev) => ({
      ...prev,
      notices: [newNotice, ...prev.notices],
    }));
  };

  // Admin: Menu Management (Add, Edit, Remove)
  const addDish = (dish: Omit<DishItem, 'id'>) => {
    const newDish: DishItem = {
      ...dish,
      id: `dish-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      dishes: [...prev.dishes, newDish],
    }));
  };

  const editDish = (dish: DishItem) => {
    setState((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) => (d.id === dish.id ? dish : d)),
    }));
  };

  const removeDish = (dishId: string) => {
    setState((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((d) => d.id !== dishId),
    }));
  };

  // Admin: Add Waste Log
  const addWasteLog = (entry: Omit<WasteLogEntry, 'id'>) => {
    const newEntry: WasteLogEntry = {
      ...entry,
      id: `wl-${Date.now()}`,
    };
    const todayIso = new Date().toISOString().split('T')[0];
    setState((prev) => {
      const updatedStats = prev.historicalStats.map((stat, idx) => {
        if (stat.date === todayIso || idx === prev.historicalStats.length - 1) {
          const totalWasteKg = Math.round((stat.totalWasteKg + newEntry.wasteWeightKg) * 10) / 10;
          const cleanRate =
            newEntry.returnedPlates > 0
              ? Math.round(((newEntry.returnedPlates - newEntry.platesWithWaste) / newEntry.returnedPlates) * 100)
              : stat.cleanPlatesPercent;
          return {
            ...stat,
            totalWasteKg,
            cleanPlatesPercent: cleanRate,
            topWastedDish: newEntry.dishName,
            topReason: newEntry.observedReason,
          };
        }
        return stat;
      });
      return {
        ...prev,
        wasteLogs: [newEntry, ...prev.wasteLogs],
        historicalStats: updatedStats,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeStudent,
        selectedMessId: state.selectedMessId,
        adminSelectedMessId: state.adminSelectedMessId,
        setRole,
        setActiveStudentId,
        setSelectedMessId,
        setAdminSelectedMessId,
        setActiveStudentScreen,
        setActiveAdminScreen,
        toggleDarkMode,
        toggleMobilePreview,
        resetDemoData,
        calculateWaitTime,
        calculateCrowdLevel,
        registerStudent,
        toggleReminder,
        setPreCommit,
        bookSlot,
        cancelBooking,
        submitFeedback,
        updateQueueCount,
        toggleCounter,
        updateServiceRate,
        updateSlotCapacity,
        broadcastNotice,
        addDish,
        editDish,
        removeDish,
        addWasteLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

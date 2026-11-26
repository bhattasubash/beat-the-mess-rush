import {
  AppState,
  DailyReportStat,
  DishItem,
  MessId,
  MessInfo,
  StudentProfile,
  TimeSlotData,
} from '../types';

export const DEFAULT_STUDENTS: StudentProfile[] = [
  {
    id: 's1',
    name: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    hostel: 'Hostel 1 (Aryabhatta)',
    room: 'Room 304',
    preferredMessId: 'north',
    dietPreference: 'Veg',
  },
];

export function createInitialMesses(): Record<MessId, MessInfo> {
  const nowIso = new Date().toISOString();
  return {
    north: {
      id: 'north',
      name: 'North Mess',
      hostelLabel: 'Hostel 1 & 2',
      location: 'North Campus, Block A',
      totalCapacity: 500,
      openCounters: 2,
      totalCounters: 4,
      queueCount: 0,
      serviceRate: 2.0,
      slotCapacity: 45,
      lastUpdated: nowIso,
      bestTimeLunch: '12:15 – 12:30 PM',
      bestTimeDinner: '7:30 – 7:45 PM',
    },
    south: {
      id: 'south',
      name: 'South Mess',
      hostelLabel: 'Hostel 3 & 4',
      location: 'South Campus Quad',
      totalCapacity: 450,
      openCounters: 2,
      totalCounters: 3,
      queueCount: 0,
      serviceRate: 2.0,
      slotCapacity: 40,
      lastUpdated: nowIso,
      bestTimeLunch: '12:15 – 12:30 PM',
      bestTimeDinner: '7:30 – 7:45 PM',
    },
    central: {
      id: 'central',
      name: 'Central Dining Hall',
      hostelLabel: 'Hostel 5 & 6',
      location: 'Central Student Activity Center',
      totalCapacity: 800,
      openCounters: 3,
      totalCounters: 5,
      queueCount: 0,
      serviceRate: 2.0,
      slotCapacity: 65,
      lastUpdated: nowIso,
      bestTimeLunch: '12:15 – 12:30 PM',
      bestTimeDinner: '7:30 – 7:45 PM',
    },
  };
}

export const INITIAL_DISHES: DishItem[] = [
  // North Mess - Lunch
  { id: 'n-l-1', messId: 'north', name: 'Paneer Butter Masala', meal: 'Lunch', category: 'Main', diet: 'Veg', calories: 290, standardPortionGrams: 180 },
  { id: 'n-l-2', messId: 'north', name: 'Yellow Dal Tadka', meal: 'Lunch', category: 'Dal', diet: 'Vegan', calories: 150, standardPortionGrams: 150 },
  { id: 'n-l-3', messId: 'north', name: 'Steamed Basmati Rice', meal: 'Lunch', category: 'Rice', diet: 'Vegan', calories: 210, standardPortionGrams: 200 },
  { id: 'n-l-4', messId: 'north', name: 'Butter Phulka Roti (3 pcs)', meal: 'Lunch', category: 'Bread', diet: 'Veg', calories: 240, standardPortionGrams: 120 },
  { id: 'n-l-5', messId: 'north', name: 'Cucumber Boondi Raita', meal: 'Lunch', category: 'Side', diet: 'Veg', calories: 95, standardPortionGrams: 100 },
  { id: 'n-l-6', messId: 'north', name: 'Gulab Jamun (2 pcs)', meal: 'Lunch', category: 'Sweet', diet: 'Veg', calories: 280, standardPortionGrams: 80 },

  // North Mess - Dinner
  { id: 'n-d-1', messId: 'north', name: 'Kadhai Veg Delight', meal: 'Dinner', category: 'Main', diet: 'Veg', calories: 240, standardPortionGrams: 170 },
  { id: 'n-d-2', messId: 'north', name: 'Panchmel Dal', meal: 'Dinner', category: 'Dal', diet: 'Vegan', calories: 160, standardPortionGrams: 150 },
  { id: 'n-d-3', messId: 'north', name: 'Jeera Peas Pulao', meal: 'Dinner', category: 'Rice', diet: 'Vegan', calories: 230, standardPortionGrams: 200 },
  { id: 'n-d-4', messId: 'north', name: 'Tandoori Roti (2 pcs)', meal: 'Dinner', category: 'Bread', diet: 'Vegan', calories: 190, standardPortionGrams: 110 },
  { id: 'n-d-5', messId: 'north', name: 'Green Salad & Mint Chutney', meal: 'Dinner', category: 'Side', diet: 'Vegan', calories: 45, standardPortionGrams: 80 },
  { id: 'n-d-6', messId: 'north', name: 'Moong Dal Halwa', meal: 'Dinner', category: 'Sweet', diet: 'Veg', calories: 310, standardPortionGrams: 90 },

  // South Mess - Lunch
  { id: 's-l-1', messId: 'south', name: 'Chole Masala (Amritsari)', meal: 'Lunch', category: 'Main', diet: 'Vegan', calories: 280, standardPortionGrams: 180 },
  { id: 's-l-2', messId: 'south', name: 'Gujarati Sweet Dal', meal: 'Lunch', category: 'Dal', diet: 'Veg', calories: 170, standardPortionGrams: 150 },
  { id: 's-l-3', messId: 'south', name: 'Ghee Rice', meal: 'Lunch', category: 'Rice', diet: 'Veg', calories: 250, standardPortionGrams: 200 },
  { id: 's-l-4', messId: 'south', name: 'Poori / Bhature (2 pcs)', meal: 'Lunch', category: 'Bread', diet: 'Veg', calories: 320, standardPortionGrams: 130 },
  { id: 's-l-5', messId: 'south', name: 'Tomato Onion Salad', meal: 'Lunch', category: 'Side', diet: 'Vegan', calories: 40, standardPortionGrams: 80 },
  { id: 's-l-6', messId: 'south', name: 'Rasgulla (2 pcs)', meal: 'Lunch', category: 'Sweet', diet: 'Veg', calories: 210, standardPortionGrams: 85 },

  // South Mess - Dinner
  { id: 's-d-1', messId: 'south', name: 'Methi Malai Matar', meal: 'Dinner', category: 'Main', diet: 'Veg', calories: 260, standardPortionGrams: 170 },
  { id: 's-d-2', messId: 'south', name: 'Dal Fry with Tadka', meal: 'Dinner', category: 'Dal', diet: 'Vegan', calories: 155, standardPortionGrams: 150 },
  { id: 's-d-3', messId: 'south', name: 'Steamed Rice', meal: 'Dinner', category: 'Rice', diet: 'Vegan', calories: 200, standardPortionGrams: 200 },
  { id: 's-d-4', messId: 'south', name: 'Chapati with Ghee (3 pcs)', meal: 'Dinner', category: 'Bread', diet: 'Veg', calories: 230, standardPortionGrams: 120 },
  { id: 's-d-5', messId: 'south', name: 'Mixed Veg Pickle & Papad', meal: 'Dinner', category: 'Side', diet: 'Vegan', calories: 60, standardPortionGrams: 50 },
  { id: 's-d-6', messId: 'south', name: 'Kheer (Rice Pudding)', meal: 'Dinner', category: 'Sweet', diet: 'Veg', calories: 250, standardPortionGrams: 100 },

  // Central Mess - Lunch
  { id: 'c-l-1', messId: 'central', name: 'Shahi Paneer / Chicken Curry', meal: 'Lunch', category: 'Main', diet: 'Non-Veg', calories: 310, standardPortionGrams: 190 },
  { id: 'c-l-2', messId: 'central', name: 'Dal Makhani', meal: 'Lunch', category: 'Dal', diet: 'Veg', calories: 240, standardPortionGrams: 160 },
  { id: 'c-l-3', messId: 'central', name: 'Veg Biryani', meal: 'Lunch', category: 'Rice', diet: 'Veg', calories: 280, standardPortionGrams: 220 },
  { id: 'c-l-4', messId: 'central', name: 'Naan / Laccha Paratha', meal: 'Lunch', category: 'Bread', diet: 'Veg', calories: 290, standardPortionGrams: 130 },
  { id: 'c-l-5', messId: 'central', name: 'Pineapple Raita', meal: 'Lunch', category: 'Side', diet: 'Veg', calories: 110, standardPortionGrams: 100 },
  { id: 'c-l-6', messId: 'central', name: 'Vanilla Ice Cream Cup', meal: 'Lunch', category: 'Sweet', diet: 'Veg', calories: 180, standardPortionGrams: 75 },

  // Central Mess - Dinner
  { id: 'c-d-1', messId: 'central', name: 'Mix Veg Kolhapuri', meal: 'Dinner', category: 'Main', diet: 'Veg', calories: 230, standardPortionGrams: 180 },
  { id: 'c-d-2', messId: 'central', name: 'Chana Dal Tadka', meal: 'Dinner', category: 'Dal', diet: 'Vegan', calories: 165, standardPortionGrams: 150 },
  { id: 'c-d-3', messId: 'central', name: 'Lemon Rice & Curd Rice', meal: 'Dinner', category: 'Rice', diet: 'Veg', calories: 220, standardPortionGrams: 200 },
  { id: 'c-d-4', messId: 'central', name: 'Fresh Phulka (3 pcs)', meal: 'Dinner', category: 'Bread', diet: 'Vegan', calories: 210, standardPortionGrams: 110 },
  { id: 'c-d-5', messId: 'central', name: 'Kachumber Salad', meal: 'Dinner', category: 'Side', diet: 'Vegan', calories: 35, standardPortionGrams: 80 },
  { id: 'c-d-6', messId: 'central', name: 'Jalebi (3 pcs)', meal: 'Dinner', category: 'Sweet', diet: 'Veg', calories: 290, standardPortionGrams: 85 },
];

export function generateSlotsForMess(messId: MessId, slotCapacity?: number): TimeSlotData[] {
  const cap = slotCapacity ?? createInitialMesses()[messId].slotCapacity;
  const slots: TimeSlotData[] = [];

  const lunchTimes = [
    { start: '12:00', end: '12:15' },
    { start: '12:15', end: '12:30' },
    { start: '12:30', end: '12:45' },
    { start: '12:45', end: '13:00' },
    { start: '13:00', end: '13:15' },
    { start: '13:15', end: '13:30' },
    { start: '13:30', end: '13:45' },
    { start: '13:45', end: '14:00' },
  ];

  lunchTimes.forEach((slot) => {
    slots.push({
      id: `${messId}-Lunch-${slot.start}`,
      messId,
      meal: 'Lunch',
      startTime: slot.start,
      endTime: slot.end,
      capacity: cap,
      bookedCount: 0,
    });
  });

  const dinnerTimes = [
    { start: '19:30', end: '19:45' },
    { start: '19:45', end: '20:00' },
    { start: '20:00', end: '20:15' },
    { start: '20:15', end: '20:30' },
    { start: '20:30', end: '20:45' },
    { start: '20:45', end: '21:00' },
    { start: '21:00', end: '21:15' },
    { start: '21:15', end: '21:30' },
  ];

  dinnerTimes.forEach((slot) => {
    slots.push({
      id: `${messId}-Dinner-${slot.start}`,
      messId,
      meal: 'Dinner',
      startTime: slot.start,
      endTime: slot.end,
      capacity: cap,
      bookedCount: 0,
    });
  });

  return slots;
}

export function createRollingHistoricalStats(): DailyReportStat[] {
  const stats: DailyReportStat[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayLabel =
      i === 0
        ? `Today (${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    stats.push({
      date: iso,
      dayLabel,
      lunchDiners: 0,
      dinnerDiners: 0,
      totalWasteKg: 0,
      avgWaitMins: 0,
      cleanPlatesPercent: 100,
      topWastedDish: 'None',
      topReason: 'Other',
    });
  }
  return stats;
}

export function getInitialAppState(): AppState {
  const messes = createInitialMesses();
  const allSlots = [
    ...generateSlotsForMess('north', messes.north.slotCapacity),
    ...generateSlotsForMess('south', messes.south.slotCapacity),
    ...generateSlotsForMess('central', messes.central.slotCapacity),
  ];

  return {
    currentRole: 'student',
    activeStudentId: DEFAULT_STUDENTS[0].id,
    students: DEFAULT_STUDENTS,
    selectedMessId: 'north',
    adminSelectedMessId: 'north',
    messes,
    dishes: INITIAL_DISHES,
    slots: allSlots,
    studentBookings: [],
    studentPreCommits: {},
    reminders: {},
    feedbacks: [],
    notices: [],
    wasteLogs: [],
    historicalStats: createRollingHistoricalStats(),
    activeStudentScreen: 'home',
    activeAdminScreen: 'dashboard',
    isDarkMode: false,
    mobilePreviewMode: false,
  };
}

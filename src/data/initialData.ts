import {
  AppState,
  DailyReportStat,
  DishItem,
  FeedbackRecord,
  MessId,
  MessInfo,
  MessNotice,
  SlotBooking,
  StudentProfile,
  TimeSlotData,
  WasteLogEntry,
} from '../types';

export const DEMO_STUDENTS: StudentProfile[] = [
  {
    id: 's1',
    name: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    hostel: 'Hostel 1 (Aryabhatta)',
    room: 'Room 304',
    preferredMessId: 'north',
    dietPreference: 'Veg',
  },
  {
    id: 's2',
    name: 'Diya Patel',
    rollNumber: '23BEE2108',
    hostel: 'Hostel 3 (Ramanujan)',
    room: 'Room 112',
    preferredMessId: 'south',
    dietPreference: 'Veg',
  },
  {
    id: 's3',
    name: 'Kabir Mehta',
    rollNumber: '21BME0819',
    hostel: 'Hostel 5 (Kalam)',
    room: 'Room 418',
    preferredMessId: 'central',
    dietPreference: 'Non-Veg',
  },
];

export const INITIAL_MESSES: Record<MessId, MessInfo> = {
  north: {
    id: 'north',
    name: 'North Mess',
    hostelLabel: 'Aryabhatta & Bose Halls (H1, H2)',
    location: 'North Campus, Block A',
    totalCapacity: 500,
    openCounters: 2,
    totalCounters: 4,
    queueCount: 16, // 16 / (2 * 2.0) = 4 min -> Low
    serviceRate: 2.0,
    slotCapacity: 45,
    lastUpdated: 'Just now (12:28 PM)',
    bestTimeLunch: '1:15 PM – 1:45 PM',
    bestTimeDinner: '8:45 PM – 9:15 PM',
  },
  south: {
    id: 'south',
    name: 'South Mess',
    hostelLabel: 'Ramanujan & Sarabhai Halls (H3, H4)',
    location: 'South Campus Quad',
    totalCapacity: 450,
    openCounters: 2,
    totalCounters: 3,
    queueCount: 28, // 28 / (2 * 2.0) = 7.0 min -> Medium
    serviceRate: 2.0,
    slotCapacity: 40,
    lastUpdated: '1 min ago',
    bestTimeLunch: '12:00 PM – 12:30 PM',
    bestTimeDinner: '7:30 PM – 8:00 PM',
  },
  central: {
    id: 'central',
    name: 'Central Dining Hall',
    hostelLabel: 'Dr. Kalam Block & Day Scholars (H5, H6)',
    location: 'Central Student Activity Center',
    totalCapacity: 800,
    openCounters: 2,
    totalCounters: 5,
    queueCount: 56, // 56 / (2 * 2.0) = 14 min -> High
    serviceRate: 2.0,
    slotCapacity: 65,
    lastUpdated: '2 mins ago',
    bestTimeLunch: '1:30 PM – 2:00 PM',
    bestTimeDinner: '9:00 PM – 9:30 PM',
  },
};

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

export function generateSlotsForMess(messId: MessId): TimeSlotData[] {
  const cap = INITIAL_MESSES[messId].slotCapacity;
  const slots: TimeSlotData[] = [];

  // Lunch slots: 12:00 to 14:00 (8 slots of 15 min)
  const lunchTimes = [
    { start: '12:00', end: '12:15', booked: Math.floor(cap * 0.45) },
    { start: '12:15', end: '12:30', booked: Math.floor(cap * 0.70) },
    { start: '12:30', end: '12:45', booked: cap }, // FULL slot
    { start: '12:45', end: '13:00', booked: cap - 2 },
    { start: '13:00', end: '13:15', booked: Math.floor(cap * 0.65) },
    { start: '13:15', end: '13:30', booked: Math.floor(cap * 0.35) },
    { start: '13:30', end: '13:45', booked: Math.floor(cap * 0.20) },
    { start: '13:45', end: '14:00', booked: Math.floor(cap * 0.15) },
  ];

  lunchTimes.forEach((slot) => {
    slots.push({
      id: `${messId}-Lunch-${slot.start}`,
      messId,
      meal: 'Lunch',
      startTime: slot.start,
      endTime: slot.end,
      capacity: cap,
      bookedCount: slot.booked,
    });
  });

  // Dinner slots: 19:30 to 21:30 (8 slots of 15 min)
  const dinnerTimes = [
    { start: '19:30', end: '19:45', booked: Math.floor(cap * 0.30) },
    { start: '19:45', end: '20:00', booked: Math.floor(cap * 0.55) },
    { start: '20:00', end: '20:15', booked: cap }, // FULL slot
    { start: '20:15', end: '20:30', booked: cap - 1 },
    { start: '20:30', end: '20:45', booked: Math.floor(cap * 0.75) },
    { start: '20:45', end: '21:00', booked: Math.floor(cap * 0.50) },
    { start: '21:00', end: '21:15', booked: Math.floor(cap * 0.25) },
    { start: '21:15', end: '21:30', booked: Math.floor(cap * 0.10) },
  ];

  dinnerTimes.forEach((slot) => {
    slots.push({
      id: `${messId}-Dinner-${slot.start}`,
      messId,
      meal: 'Dinner',
      startTime: slot.start,
      endTime: slot.end,
      capacity: cap,
      bookedCount: slot.booked,
    });
  });

  return slots;
}

export const INITIAL_NOTICES: MessNotice[] = [
  {
    id: 'n-1',
    messId: 'all',
    title: 'Hot Fresh Batch Ready',
    message: 'Counter 2 in North Mess just loaded hot Phulkas. Fast queue moving!',
    timestamp: '5m ago',
    type: 'success',
  },
  {
    id: 'n-2',
    messId: 'central',
    title: 'High Rush at Central Mess',
    message: 'Consider visiting after 1:25 PM or choosing South Mess for <5 min wait.',
    timestamp: '12m ago',
    type: 'alert',
  },
  {
    id: 'n-3',
    messId: 'north',
    title: 'Special Dessert Today',
    message: 'Warm Gulab Jamun served with lunch. Pre-select Regular portion to reduce waste!',
    timestamp: '25m ago',
    type: 'info',
  },
];

export const INITIAL_BOOKINGS: SlotBooking[] = [
  {
    id: 'b-today-1',
    bookingCode: 'BMR-N-L-8412',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    messId: 'north',
    meal: 'Lunch',
    slotId: 'north-Lunch-12:45',
    startTime: '12:45',
    endTime: '13:00',
    date: new Date().toISOString().split('T')[0],
    timestamp: '11:15 AM',
    status: 'Confirmed',
    portions: {
      'n-l-1': { willEat: true, portion: 'Regular' },
      'n-l-2': { willEat: true, portion: 'Small' },
      'n-l-3': { willEat: true, portion: 'Regular' },
      'n-l-4': { willEat: true, portion: 'Regular' },
      'n-l-5': { willEat: false, portion: 'Small' },
      'n-l-6': { willEat: true, portion: 'Regular' },
    },
  },
  // Past historical bookings for s1
  {
    id: 'b-hist-1',
    bookingCode: 'BMR-N-D-3921',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    messId: 'north',
    meal: 'Dinner',
    slotId: 'north-Dinner-20:30',
    startTime: '20:30',
    endTime: '20:45',
    date: 'Yesterday',
    timestamp: 'Yesterday 6:30 PM',
    status: 'Attended',
    portions: {},
  },
  {
    id: 'b-hist-2',
    bookingCode: 'BMR-N-L-1823',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    messId: 'north',
    meal: 'Lunch',
    slotId: 'north-Lunch-13:00',
    startTime: '13:00',
    endTime: '13:15',
    date: '2 days ago',
    timestamp: '2 days ago 11:00 AM',
    status: 'Attended',
    portions: {},
  },
  {
    id: 'b-hist-3',
    bookingCode: 'BMR-S-D-7811',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    rollNumber: '22BCE1042',
    messId: 'south',
    meal: 'Dinner',
    slotId: 'south-Dinner-20:00',
    startTime: '20:00',
    endTime: '20:15',
    date: '3 days ago',
    timestamp: '3 days ago 7:15 PM',
    status: 'Attended',
    portions: {},
  },
];

export const INITIAL_FEEDBACKS: FeedbackRecord[] = [
  {
    id: 'f-1',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    messId: 'north',
    meal: 'Dinner',
    date: 'Yesterday',
    timestamp: 'Yesterday 8:45 PM',
    dishRatings: { 'n-d-1': 4, 'n-d-2': 3, 'n-d-3': 5 },
    leftoverAmount: 'Clean Plate',
    comments: 'Great jeera rice! Pre-ordering regular portion was just right.',
  },
  {
    id: 'f-2',
    studentId: 's2',
    studentName: 'Diya Patel',
    messId: 'south',
    meal: 'Lunch',
    date: 'Yesterday',
    timestamp: 'Yesterday 1:40 PM',
    dishRatings: { 's-l-1': 4, 's-l-3': 2 },
    leftoverAmount: '25% - 50%',
    leftoverReason: 'Portion too big',
    comments: 'Rice portion was huge, would prefer half-cup next time.',
  },
  {
    id: 'f-3',
    studentId: 's3',
    studentName: 'Kabir Mehta',
    messId: 'central',
    meal: 'Lunch',
    date: '2 days ago',
    timestamp: '2 days ago 1:55 PM',
    dishRatings: { 'c-l-1': 4, 'c-l-4': 2 },
    leftoverAmount: '< 25%',
    leftoverReason: 'Too cold',
    comments: 'Naan was slightly cold when I reached counter 3.',
  },
  {
    id: 'f-4',
    studentId: 's1',
    studentName: 'Aarav Sharma',
    messId: 'north',
    meal: 'Lunch',
    date: '3 days ago',
    timestamp: '3 days ago 1:30 PM',
    dishRatings: { 'n-l-1': 5, 'n-l-4': 4 },
    leftoverAmount: 'Clean Plate',
    comments: 'Super fast queue with the 1:15 slot!',
  },
];

export const INITIAL_WASTE_LOGS: WasteLogEntry[] = [
  {
    id: 'wl-1',
    date: 'Today',
    messId: 'north',
    meal: 'Lunch',
    dishName: 'Yellow Dal Tadka & Steamed Rice',
    returnedPlates: 340,
    platesWithWaste: 42,
    wasteWeightKg: 6.8,
    observedReason: 'Portion too big',
    loggedBy: 'Supervisor Ramesh',
  },
  {
    id: 'wl-2',
    date: 'Yesterday',
    messId: 'north',
    meal: 'Dinner',
    dishName: 'Kadhai Veg Delight',
    returnedPlates: 310,
    platesWithWaste: 38,
    wasteWeightKg: 5.4,
    observedReason: 'Taste',
    loggedBy: 'Supervisor Ramesh',
  },
  {
    id: 'wl-3',
    date: 'Yesterday',
    messId: 'south',
    meal: 'Lunch',
    dishName: 'Ghee Rice & Gujarati Dal',
    returnedPlates: 295,
    platesWithWaste: 54,
    wasteWeightKg: 8.9,
    observedReason: 'Portion too big',
    loggedBy: 'Manager Sunder',
  },
  {
    id: 'wl-4',
    date: '2 days ago',
    messId: 'central',
    meal: 'Dinner',
    dishName: 'Lemon Rice & Curd Rice',
    returnedPlates: 520,
    platesWithWaste: 92,
    wasteWeightKg: 14.2,
    observedReason: 'Too cold',
    loggedBy: 'Chief Incharge Vikram',
  },
  {
    id: 'wl-5',
    date: '3 days ago',
    messId: 'north',
    meal: 'Lunch',
    dishName: 'Chole Masala & Phulka',
    returnedPlates: 360,
    platesWithWaste: 31,
    wasteWeightKg: 4.8,
    observedReason: 'No time',
    loggedBy: 'Supervisor Ramesh',
  },
  {
    id: 'wl-6',
    date: '4 days ago',
    messId: 'south',
    meal: 'Dinner',
    dishName: 'Dal Fry & Chapati',
    returnedPlates: 280,
    platesWithWaste: 35,
    wasteWeightKg: 5.1,
    observedReason: 'Taste',
    loggedBy: 'Manager Sunder',
  },
  {
    id: 'wl-7',
    date: '5 days ago',
    messId: 'central',
    meal: 'Lunch',
    dishName: 'Veg Biryani & Raita',
    returnedPlates: 540,
    platesWithWaste: 80,
    wasteWeightKg: 12.6,
    observedReason: 'Portion too big',
    loggedBy: 'Chief Incharge Vikram',
  },
];

export const INITIAL_HISTORICAL_STATS: DailyReportStat[] = [
  {
    date: 'Day -6',
    dayLabel: 'Thu, Nov 19',
    lunchDiners: 890,
    dinnerDiners: 840,
    totalWasteKg: 38.5,
    avgWaitMins: 11.2,
    cleanPlatesPercent: 78,
    topWastedDish: 'Steamed Rice',
    topReason: 'Portion too big',
  },
  {
    date: 'Day -5',
    dayLabel: 'Fri, Nov 20',
    lunchDiners: 920,
    dinnerDiners: 870,
    totalWasteKg: 35.2,
    avgWaitMins: 9.8,
    cleanPlatesPercent: 81,
    topWastedDish: 'Plain Dal',
    topReason: 'Taste',
  },
  {
    date: 'Day -4',
    dayLabel: 'Sat, Nov 21',
    lunchDiners: 780,
    dinnerDiners: 740,
    totalWasteKg: 28.4,
    avgWaitMins: 6.4,
    cleanPlatesPercent: 86,
    topWastedDish: 'Poori',
    topReason: 'Too cold',
  },
  {
    date: 'Day -3',
    dayLabel: 'Sun, Nov 22',
    lunchDiners: 960,
    dinnerDiners: 910,
    totalWasteKg: 32.1,
    avgWaitMins: 12.5,
    cleanPlatesPercent: 82,
    topWastedDish: 'Veg Pulao',
    topReason: 'Portion too big',
  },
  {
    date: 'Day -2',
    dayLabel: 'Mon, Nov 23',
    lunchDiners: 940,
    dinnerDiners: 890,
    totalWasteKg: 24.6,
    avgWaitMins: 7.2,
    cleanPlatesPercent: 89,
    topWastedDish: 'Salad & Rice',
    topReason: 'Portion too big',
  },
  {
    date: 'Day -1',
    dayLabel: 'Tue, Nov 24',
    lunchDiners: 930,
    dinnerDiners: 880,
    totalWasteKg: 21.3,
    avgWaitMins: 5.8,
    cleanPlatesPercent: 91,
    topWastedDish: 'Dal Tadka',
    topReason: 'Taste',
  },
  {
    date: 'Today',
    dayLabel: 'Wed, Nov 25 (Today)',
    lunchDiners: 915,
    dinnerDiners: 860,
    totalWasteKg: 17.8,
    avgWaitMins: 5.1,
    cleanPlatesPercent: 93,
    topWastedDish: 'Rice portions',
    topReason: 'Portion too big',
  },
];

export function getInitialAppState(): AppState {
  const allSlots = [
    ...generateSlotsForMess('north'),
    ...generateSlotsForMess('south'),
    ...generateSlotsForMess('central'),
  ];

  // Initial student pre-commits for demo
  const initialCommits: Record<string, any> = {
    's1_n-l-1': { dishId: 'n-l-1', willEat: true, portion: 'Regular' },
    's1_n-l-2': { dishId: 'n-l-2', willEat: true, portion: 'Small' },
    's1_n-l-3': { dishId: 'n-l-3', willEat: true, portion: 'Regular' },
    's1_n-l-4': { dishId: 'n-l-4', willEat: true, portion: 'Regular' },
    's1_n-l-5': { dishId: 'n-l-5', willEat: false, portion: 'Small' },
    's1_n-l-6': { dishId: 'n-l-6', willEat: true, portion: 'Regular' },
  };

  return {
    currentRole: 'student',
    activeStudentId: 's1',
    selectedMessId: 'north',
    adminSelectedMessId: 'north',
    messes: INITIAL_MESSES,
    dishes: INITIAL_DISHES,
    slots: allSlots,
    studentBookings: INITIAL_BOOKINGS,
    studentPreCommits: initialCommits,
    feedbacks: INITIAL_FEEDBACKS,
    notices: INITIAL_NOTICES,
    wasteLogs: INITIAL_WASTE_LOGS,
    historicalStats: INITIAL_HISTORICAL_STATS,
    activeStudentScreen: 'home',
    activeAdminScreen: 'dashboard',
    isDarkMode: false,
    mobilePreviewMode: false,
  };
}

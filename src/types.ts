export type Role = 'student' | 'admin';

export type MessId = 'north' | 'south' | 'central';

export type MealType = 'Lunch' | 'Dinner';

export type CrowdLevel = 'Low' | 'Medium' | 'High';

export type PortionSize = 'Small' | 'Regular' | 'Large';

export type LeftoverReason =
  | 'Portion too big'
  | 'Taste'
  | 'Too cold'
  | 'No time'
  | 'Other';

export type LeftoverAmount = 'Clean Plate' | '< 25%' | '25% - 50%' | '> 50%';

export interface MessInfo {
  id: MessId;
  name: string;
  hostelLabel: string;
  location: string;
  totalCapacity: number;
  openCounters: number;
  totalCounters: number;
  queueCount: number;
  serviceRate: number; // students served per counter per minute (editable)
  slotCapacity: number; // default capacity per 15-min slot
  lastUpdated: string;
  bestTimeLunch: string;
  bestTimeDinner: string;
}

export interface DishItem {
  id: string;
  messId: MessId;
  name: string;
  meal: MealType;
  category: 'Main' | 'Dal' | 'Rice' | 'Bread' | 'Side' | 'Sweet';
  diet: 'Veg' | 'Non-Veg' | 'Vegan';
  calories?: number;
  standardPortionGrams: number;
}

export interface StudentPreCommit {
  dishId: string;
  willEat: boolean;
  portion: PortionSize;
}

export interface TimeSlotData {
  id: string; // e.g., 'north-Lunch-12:15'
  messId: MessId;
  meal: MealType;
  startTime: string; // e.g. "12:15"
  endTime: string;   // e.g. "12:30"
  capacity: number;
  bookedCount: number;
}

export interface SlotBooking {
  id: string;
  bookingCode: string; // e.g. "BMR-7429"
  studentId: string;
  studentName: string;
  rollNumber: string;
  messId: MessId;
  meal: MealType;
  slotId: string;
  startTime: string;
  endTime: string;
  date: string;
  timestamp: string;
  status: 'Confirmed' | 'Attended' | 'Cancelled';
  portions: Record<string, { willEat: boolean; portion: PortionSize }>;
}

export interface FeedbackRecord {
  id: string;
  studentId: string;
  studentName: string;
  messId: MessId;
  meal: MealType;
  date: string;
  timestamp: string;
  dishRatings: Record<string, number>; // dishId -> 1-5 rating
  leftoverAmount: LeftoverAmount;
  leftoverReason?: LeftoverReason;
  comments?: string;
}

export interface MessNotice {
  id: string;
  messId: MessId | 'all';
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success';
}

export interface WasteLogEntry {
  id: string;
  date: string;
  messId: MessId;
  meal: MealType;
  dishName: string;
  returnedPlates: number;
  platesWithWaste: number;
  wasteWeightKg: number;
  observedReason: LeftoverReason;
  loggedBy: string;
}

export interface DailyReportStat {
  date: string;
  dayLabel: string;
  lunchDiners: number;
  dinnerDiners: number;
  totalWasteKg: number;
  avgWaitMins: number;
  cleanPlatesPercent: number;
  topWastedDish: string;
  topReason: LeftoverReason;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  hostel: string;
  room: string;
  preferredMessId: MessId;
  dietPreference: 'Veg' | 'Non-Veg';
}

export interface AppState {
  currentRole: Role;
  activeStudentId: string;
  selectedMessId: MessId;
  adminSelectedMessId: MessId;
  messes: Record<MessId, MessInfo>;
  dishes: DishItem[];
  slots: TimeSlotData[];
  studentBookings: SlotBooking[];
  studentPreCommits: Record<string, StudentPreCommit>; // key: `${studentId}_${dishId}`
  feedbacks: FeedbackRecord[];
  notices: MessNotice[];
  wasteLogs: WasteLogEntry[];
  historicalStats: DailyReportStat[];
  activeStudentScreen: 'home' | 'menu' | 'slots' | 'feedback' | 'history';
  activeAdminScreen: 'dashboard' | 'forecast' | 'menu' | 'queue' | 'waste' | 'reports';
  isDarkMode: boolean;
  mobilePreviewMode: boolean; // toggle to view student page in realistic mobile frame on desktop
}

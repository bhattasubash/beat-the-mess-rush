export type ScreenId =
  | 'setup'
  | 'now'
  | 'best-time'
  | 'reminder'
  | 'menu-vote'
  | 'feedback';

export type MessId = 'hostel-7' | 'hostel-3' | 'hostel-12' | 'central';

export type CrowdLevel = 'Calm' | 'Busy' | 'Packed';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export type DishChoice = 'eat' | 'skip';

export type FeedbackIssueId = 'queue' | 'uneaten' | 'cleanliness';

export interface MessHall {
  id: MessId;
  name: string;
  shortName: string;
  optionLabel: string;
  subtitle: string;
  defaultCrowd: CrowdLevel;
  walkingMinutes: number;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  level: CrowdLevel;
  waitMinutes: number;
  note: string;
  recommended: boolean;
  reminderTime: string;
}

export interface DishItem {
  id: string;
  number: number;
  name: string;
  description: string;
  defaultChoice: DishChoice;
}

export interface ReminderInfo {
  slotId: string;
  messId: MessId;
  slotRange: string;
  slotLevel: CrowdLevel;
  alertTime: string;
  meal: MealType;
}

export interface FeedbackEntry {
  id: string;
  messId: MessId;
  issueId: FeedbackIssueId;
  issueTitle: string;
  note: string;
  timestamp: string;
}

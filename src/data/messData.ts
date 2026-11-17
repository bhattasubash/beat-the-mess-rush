import {
  CrowdLevel,
  DishItem,
  FeedbackIssueId,
  MealType,
  MessHall,
  MessId,
  TimeSlot,
} from '../types';

export const MESS_HALLS: MessHall[] = [
  {
    id: 'hostel-7',
    name: 'Hostel 7 Dining Hall',
    shortName: 'Hostel 7',
    optionLabel: 'Hostel 7 Dining Hall (Main)',
    subtitle: 'Primary Mess',
    defaultCrowd: 'Busy',
    walkingMinutes: 3,
  },
  {
    id: 'hostel-3',
    name: 'Hostel 3 South Mess',
    shortName: 'Hostel 3',
    optionLabel: 'Hostel 3 South Mess',
    subtitle: 'South Wing Mess',
    defaultCrowd: 'Calm',
    walkingMinutes: 5,
  },
  {
    id: 'hostel-12',
    name: 'Hostel 12 North Wing Mess',
    shortName: 'Hostel 12',
    optionLabel: 'Hostel 12 North Wing Mess',
    subtitle: 'North Wing Mess',
    defaultCrowd: 'Packed',
    walkingMinutes: 7,
  },
  {
    id: 'central',
    name: 'Central Campus Dining',
    shortName: 'Central Dining',
    optionLabel: 'Central Campus Dining',
    subtitle: 'Central Mess',
    defaultCrowd: 'Busy',
    walkingMinutes: 6,
  },
];

export const CROWD_META: Record<
  CrowdLevel,
  { shortRange: string; waitEstimate: string }
> = {
  Calm: {
    shortRange: '< 5 min',
    waitEstimate: '< 5 min',
  },
  Busy: {
    shortRange: '5 to 10 min',
    waitEstimate: '5 to 10 min',
  },
  Packed: {
    shortRange: '> 15 min',
    waitEstimate: '> 15 min',
  },
};

export const MENU_BY_MEAL: Record<MealType, DishItem[]> = {
  Lunch: [
    {
      id: 'rajma',
      number: 1,
      name: 'Rajma',
      description: 'Kidney bean curry',
      defaultChoice: 'eat',
    },
    {
      id: 'paneer',
      number: 2,
      name: 'Paneer',
      description: 'Cottage cheese gravy',
      defaultChoice: 'eat',
    },
    {
      id: 'dal',
      number: 3,
      name: 'Dal',
      description: 'Yellow lentil soup',
      defaultChoice: 'skip',
    },
    {
      id: 'salad',
      number: 4,
      name: 'Salad',
      description: 'Cucumber & tomato',
      defaultChoice: 'eat',
    },
  ],
  Breakfast: [
    {
      id: 'poha',
      number: 1,
      name: 'Kanda Poha',
      description: 'Flattened rice with peanuts',
      defaultChoice: 'eat',
    },
    {
      id: 'paratha',
      number: 2,
      name: 'Aloo Paratha',
      description: 'Stuffed flatbread & curd',
      defaultChoice: 'eat',
    },
    {
      id: 'sprouts',
      number: 3,
      name: 'Sprouts Bowl',
      description: 'Steamed moong & lemon',
      defaultChoice: 'skip',
    },
    {
      id: 'chai',
      number: 4,
      name: 'Masala Chai',
      description: 'Spiced milk tea',
      defaultChoice: 'eat',
    },
  ],
  Dinner: [
    {
      id: 'chole',
      number: 1,
      name: 'Chole',
      description: 'Spiced chickpea curry',
      defaultChoice: 'eat',
    },
    {
      id: 'bhindi',
      number: 2,
      name: 'Bhindi Fry',
      description: 'Crisp okra & onions',
      defaultChoice: 'eat',
    },
    {
      id: 'roti',
      number: 3,
      name: 'Tawa Roti',
      description: 'Whole wheat flatbread',
      defaultChoice: 'eat',
    },
    {
      id: 'kheer',
      number: 4,
      name: 'Rice Kheer',
      description: 'Cardamom milk pudding',
      defaultChoice: 'skip',
    },
  ],
};

export const FEEDBACK_OPTIONS: {
  id: FeedbackIssueId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'queue',
    title: 'Queue too long',
    subtitle: 'Line extended outside dining hall',
  },
  {
    id: 'uneaten',
    title: 'Food left uneaten',
    subtitle: 'Taste or quality issue with a dish',
  },
  {
    id: 'cleanliness',
    title: 'Cleanliness',
    subtitle: 'Tables, trays, or water counter',
  },
];

function parseTimeToMinutes(timeStr: string): number {
  const cleaned = timeStr.trim();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return 12 * 60 + 30;
  }
  const hours = Math.min(23, Math.max(0, parseInt(match[1], 10)));
  const minutes = Math.min(59, Math.max(0, parseInt(match[2], 10)));
  return hours * 60 + minutes;
}

function formatMinutesTo24h(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatAlertLabel(time24h: string): string {
  const mins = parseTimeToMinutes(time24h);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function getCalmTimeSlots(
  breakTime: string,
  meal: MealType,
  messId: MessId
): TimeSlot[] {
  const messOffset =
    messId === 'hostel-3' ? 0 : messId === 'hostel-12' ? 5 : 0;

  if (meal === 'Lunch') {
    const breakMins = parseTimeToMinutes(breakTime);
    const slot1Start = breakMins - 15;
    const slot1End = breakMins;
    const slot2Start = breakMins + 15 + messOffset;
    const slot2End = slot2Start + 15;
    const slot3Start = breakMins + 60;
    const slot3End = slot3Start + 15;

    return [
      {
        id: 'slot-1',
        start: formatMinutesTo24h(slot1Start),
        end: formatMinutesTo24h(slot1End),
        level: 'Calm',
        waitMinutes: 3,
        note: `Fits your ${breakTime || '12:30'} class break`,
        recommended: true,
        reminderTime: formatMinutesTo24h(slot1Start - 5),
      },
      {
        id: 'slot-2',
        start: formatMinutesTo24h(slot2Start),
        end: formatMinutesTo24h(slot2End),
        level: 'Calm',
        waitMinutes: 4,
        note: 'Post-rush window',
        recommended: false,
        reminderTime: formatMinutesTo24h(slot2Start - 5),
      },
      {
        id: 'slot-3',
        start: formatMinutesTo24h(slot3Start),
        end: formatMinutesTo24h(slot3End),
        level: 'Calm',
        waitMinutes: 2,
        note: 'Late lunch quiet period',
        recommended: false,
        reminderTime: formatMinutesTo24h(slot3Start - 5),
      },
    ];
  }

  if (meal === 'Breakfast') {
    return [
      {
        id: 'b-slot-1',
        start: '07:45',
        end: '08:00',
        level: 'Calm',
        waitMinutes: 2,
        note: 'Early morning quiet window',
        recommended: true,
        reminderTime: '07:40',
      },
      {
        id: 'b-slot-2',
        start: '08:30',
        end: '08:45',
        level: 'Calm',
        waitMinutes: 4,
        note: 'Between morning lectures',
        recommended: false,
        reminderTime: '08:25',
      },
      {
        id: 'b-slot-3',
        start: '09:15',
        end: '09:30',
        level: 'Calm',
        waitMinutes: 2,
        note: 'Final breakfast service',
        recommended: false,
        reminderTime: '09:10',
      },
    ];
  }

  return [
    {
      id: 'd-slot-1',
      start: '19:45',
      end: '20:00',
      level: 'Calm',
      waitMinutes: 3,
      note: 'Pre-rush dinner opening',
      recommended: true,
      reminderTime: '19:40',
    },
    {
      id: 'd-slot-2',
      start: '20:30',
      end: '20:45',
      level: 'Calm',
      waitMinutes: 4,
      note: 'Post-rush window',
      recommended: false,
      reminderTime: '20:25',
    },
    {
      id: 'd-slot-3',
      start: '21:15',
      end: '21:30',
      level: 'Calm',
      waitMinutes: 2,
      note: 'Late dinner quiet period',
      recommended: false,
      reminderTime: '21:10',
    },
  ];
}

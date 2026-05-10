export const YOGA_STYLES = [
  "Vinyasa",
  "Hatha",
  "Yin",
  "Ashtanga",
  "Restorative",
  "Power",
  "Kundalini",
  "Hot Yoga",
  "Prenatal",
  "Meditation",
  "Breathwork",
  "Flow",
  "Stretch",
  "Mixed",
] as const;

export type YogaStyle = (typeof YOGA_STYLES)[number];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const TIME_SLOTS = [
  { label: "Morning", value: "morning", range: [5, 12] },
  { label: "Afternoon", value: "afternoon", range: [12, 17] },
  { label: "Evening", value: "evening", range: [17, 22] },
] as const;

export interface ClassWithStudio {
  id: string;
  title: string;
  style: string;
  instructor: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string | null;
  durationMin: number | null;
  priceTHB: number | null;
  dropInPriceTHB: number | null;
  locationDetail: string | null;
  isActive: boolean;
  studio: {
    id: string;
    name: string;
    slug: string;
    location: string | null;
    logoUrl: string | null;
  };
}

export interface Filters {
  style?: string;
  studioId?: string;
  dayOfWeek?: number;
  timeSlot?: string;
}

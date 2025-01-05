import { Roll } from '../useRolls.ts';

export interface SessionRequestBody {
  date: string; // YYYY-MM-DD
  duration_seconds?: number; // ux for start/end and convert
  coach?: number; //teammate id
  avg_heart_rate?: number;
  calories?: number;
  type?: string;
  roll_count: number;
}

export interface SessionResponseItem {
  id: number;
  created_at: string;
  duration_seconds: number;
  coach: number | null;
  avg_heart_rate: number;
  calories: number;
  type: string;
  user_id: string;
  date: string;
  roll_count: number;
  nogi: boolean;
  notes: string | null;
  Rolls?: Roll[];
}

export interface HydratedSession {
  id: number;
  created: string;
  durationSeconds: number;
  coach: number | null;
  avgHeartRate: number;
  calories: number;
  type: string;
  date: string;
  rollCount: number;
  notes: string;
  nogi: boolean;
  rolls?: Roll[];
}

import { Roll } from '../useRolls.ts';

export interface SessionRequestBody {
  date: string; // YYYY-MM-DD
  duration_seconds?: number; // ux for start/end and convert
  coach?: number; //teammate id
  avg_heart_rate?: number;
  calories?: number;
  type?: string;
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
  Rolls?: Roll[];
}

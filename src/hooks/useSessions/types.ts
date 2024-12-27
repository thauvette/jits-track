export interface SessionRequestBody {
  date: string; // YYYY-MM-DD
  duration_seconds?: number; // ux for start/end and convert
  coach?: number; //teammate id TODO: add teammate modal (for coach and rolls)
  roll_count?: number;
  avg_heart_rate?: number;
  calories?: number;
  type?: string;
}

export interface SessionResponseItem {
  id: number;
  created_at: string;
  duration_seconds: number;
  coach: number | null;
  roll_count: number;
  avg_heart_rate: number;
  calories: number;
  type: string;
  user_id: string;
  date: string;
  Rolls?: {
    id: number;
    session: number;
    owner_id: string;
    date_time: string;
    created_at: string;
    teammate_id: number;
  }[];
}

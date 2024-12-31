export interface ImportedSession {
  date: string;
  duration?: number | null;
  coachId?: number;
  coachName?: string;
  avg_heart_rate?: number | null;
  calories?: number | null;
  type?: string;
  rolls?: string[] | null;
  isNogi: boolean;
  error?: boolean;
  success?: boolean;
  rollCount?: number;
}

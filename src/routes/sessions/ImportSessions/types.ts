export interface ImportedSession {
  date: string;
  duration?: number | null;
  coach?: string;
  avg_heart_rate?: number | null;
  calories?: number | null;
  type?: string;
  rolls?: string[] | null;
  isNogi: boolean;
  error?: boolean;
  success?: boolean;
}

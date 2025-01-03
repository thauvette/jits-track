import { SessionResponseItem } from './types.ts';

export const formatSession = (session: SessionResponseItem) => ({
  id: session.id,
  created: session.created_at,
  durationSeconds: session.duration_seconds,
  coach: session.coach,
  avgHeartRate: session.avg_heart_rate,
  calories: session.calories,
  type: session.type,
  date: session.date,
  rollCount: session.roll_count,
  notes: session.notes ?? '',
  nogi: session.nogi,
});

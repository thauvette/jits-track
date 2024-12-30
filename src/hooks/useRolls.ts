import { useSupabase } from './useSupabase.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { belts } from '../config/betls.ts';

const rollSelect = `*, Teammates(
            id, name, belt
        )`;

export interface Roll {
  id: number;
  created: string;
  date: string;
  session: number | undefined;
  nogi: boolean;
  teammate?:
    | {
        belt: number;
        name: string;
        id: number;
        beltName: string;
      }
    | null
    | undefined;
}

export const useRolls = (props?: {
  sessionId?: number;
  dateRange?: [string, string];
  teamId?: number;
}) => {
  const { sessionId, dateRange, teamId } = props ?? {};

  const { supabase } = useSupabase();
  const queryKey: (string | number | { [key: string]: string | number })[] = [
    'rolls',
  ];
  if (sessionId) {
    queryKey.push(sessionId);
  }
  if (dateRange) {
    queryKey.push(...dateRange);
  }
  if (teamId) {
    queryKey.push({ teamId });
  }
  const queryClient = useQueryClient();

  const queryData = useQuery({
    staleTime: 1000 * 60 * 10,
    queryKey,
    queryFn: async () => {
      const query = supabase.from('Rolls').select(rollSelect);
      if (sessionId) {
        query.eq('session', sessionId);
      }

      if (dateRange) {
        query.gte('date', dateRange[0]);
        query.lte('date', dateRange[1]);
      }
      if (teamId) {
        query.eq('teammate_id', teamId);
      }
      const { data } = await query.returns<
        {
          id: number;
          created_at: string;
          date: string;
          session?: number;
          nogi: boolean;
          Teammates?: {
            id: number;
            name: string;
            belt: number;
          };
        }[]
      >();
      if (data) {
        return data.map((roll) => ({
          id: roll.id,
          created: roll.created_at,
          date: roll.date,
          session: roll.session,
          nogi: roll.nogi,
          teammate: roll.Teammates
            ? {
                ...roll.Teammates,
                beltName: belts[roll.Teammates.belt - 1],
              }
            : null,
        }));
      }
    },
  });

  const addRoll = async ({
    teammateId,
    date,
    session,
    nogi,
  }: {
    teammateId: number;
    date: string;
    session?: number;
    nogi: boolean;
  }) => {
    const req: {
      teammate_id: number;
      date: string;
      session?: number;
      nogi: boolean;
    } = {
      teammate_id: teammateId,
      date,
      nogi,
    };
    if (session) {
      req.session = session;
    }
    const { data, error } = await supabase
      .from('Rolls')
      .insert(req)
      .select(rollSelect);
    if (data) {
      await queryClient.invalidateQueries({
        queryKey: ['rolls'],
      });
    }
    return { data, error };
  };

  const removeRoll = async (id: number) => {
    const { error, data } = await supabase
      .from('Rolls')
      .delete()
      .eq('id', id)
      .select();

    if (!data?.length) {
      // TODO: error toast
      alert('NEWP');
    }

    if (!error) {
      await queryClient.invalidateQueries({
        queryKey: ['rolls'],
      });
    }
    return {
      error,
      data,
    };
  };

  return {
    ...queryData,
    addRoll,
    removeRoll,
  };
};

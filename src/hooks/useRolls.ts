import { useSupabase } from './useSupabase.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { belts } from '../config/betls.ts';
import { Belt } from './useTeammates.ts';

const rollSelect = `*, Teammates(
            id, name, belt
        )`;

export interface Roll {
  id: number;
  created: string;
  date: string;
  session: number | undefined;
  teammate?:
    | {
        belt: Belt;
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
}) => {
  const { sessionId, dateRange } = props ?? {};

  const { supabase } = useSupabase();
  const queryKey: (string | number)[] = ['rolls'];
  if (sessionId) {
    queryKey.push(sessionId);
  }
  if (dateRange) {
    queryKey.push(...dateRange);
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

      const { data } = await query.returns<
        {
          id: number;
          created_at: string;
          date: string;
          session?: number;
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
  }: {
    teammateId: number;
    date: string;
    session?: number;
  }) => {
    const req: {
      teammate_id: number;
      date: string;
      session?: number;
    } = {
      teammate_id: teammateId,
      date,
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

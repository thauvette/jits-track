import { useSupabase } from './useSupabase.ts';
import { useQuery } from '@tanstack/react-query';
import { belts } from '../config/betls.ts';
import { Belt } from './useTeammates.ts';

export interface Roll {
  id: number;
  teammate?: {
    name: string;
    belt: Belt;
    id: number;
    beltName: string;
  };
}

const rollSelect = `*, Teammates(
            id, name, belt
        )`;

export const useRolls = ({ sessionId }: { sessionId?: number }) => {
  const { supabase } = useSupabase();

  const queryData = useQuery({
    staleTime: 1000 * 60 * 10,
    queryKey: ['rolls', sessionId],
    queryFn: async () => {
      const query = supabase.from('Rolls').select(rollSelect);
      if (sessionId) {
        query.eq('session', sessionId);
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
      void queryData.refetch();
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
      void queryData.refetch();
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

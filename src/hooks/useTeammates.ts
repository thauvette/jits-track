import { useSupabase } from './useSupabase.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { belts } from '../config/betls.ts';

export interface Teammate {
  name: string;
  belt: number;
  id: number;
  isCoach: boolean;
}

export const useTeammates = (props?: { id?: number }) => {
  const { id } = props ?? {};
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  const queryKey: (string | number)[] = ['team'];
  if (id) {
    queryKey.push(id);
  }
  const getTeammates = async () => {
    const query = supabase.from('Teammates').select('*, Rolls(count)');

    if (id) {
      query.eq('id', id);
    }

    const { data: response } = await query.returns<
      {
        name: string;
        belt: number;
        id: number;
        is_coach: boolean;
        Rolls: { count: number }[];
      }[]
    >();
    return response?.map((mate) => ({
      ...mate,
      isCoach: mate.is_coach,
      beltName: belts[mate.belt - 1],
      rollCount: mate.Rolls?.[0]?.count ?? 0,
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: getTeammates,
    staleTime: 1000 * 60 * 10,
  });

  const updateTeammate = async ({
    name,
    belt,
    isCoach = false,
    id: reqId = null,
  }: {
    name: string;
    belt: number;
    isCoach: boolean;
    id: number | null;
  }) => {
    const request = {
      name,
      belt: +belt,
      is_coach: isCoach,
    };
    const { data: response } = await supabase
      .from('Teammates')
      .update(request)
      .eq('id', reqId)
      .select()
      .returns<
        {
          name: string;
          belt: number;
          is_coach: boolean;
          id: number;
        }[]
      >();
    if (response?.[0]) {
      await queryClient.invalidateQueries({
        queryKey: ['team'],
      });
      return {
        ...response[0],
        isCoach: response[0].is_coach,
      };
    }
  };

  const addTeammate = async ({
    name,
    belt,
    isCoach = false,
  }: {
    name: string;
    belt: number;
    isCoach: boolean;
  }) => {
    const request = {
      name,
      belt: +belt,
      is_coach: isCoach,
    };

    const { data: response } = await supabase
      .from('Teammates')
      .insert([request])
      .select()
      .returns<
        {
          name: string;
          belt: number;
          is_coach: boolean;
          id: number;
        }[]
      >();

    if (response?.[0]) {
      await queryClient.invalidateQueries({
        queryKey: ['team'],
      });
      return {
        ...response[0],
        isCoach: response[0].is_coach,
      };
    }
  };

  return {
    data,
    isLoading,
    addTeammate,
    updateTeammate,
  };
};

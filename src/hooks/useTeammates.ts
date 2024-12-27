import { useSupabase } from './useSupabase.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export enum Belt {
  White = 1,
  Blue,
  Purple,
  Brown,
  Black,
}

export interface Teammate {
  name: string;
  belt: Belt;
  id: number;
  isCoach: boolean;
}

export const useTeammates = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  const getTeammates = async () => {
    const { data: response } = await supabase
      .from('Teammates')
      .select('*')
      .returns<
        {
          name: string;
          belt: Belt;
          id: number;
          is_coach: boolean;
        }[]
      >();
    return response?.map((mate) => ({
      ...mate,
      isCoach: mate.is_coach,
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: getTeammates,
  });

  // add mutation

  const addTeammate = async ({
    name,
    belt,
    isCoach = false,
  }: {
    name: string;
    belt: Belt;
    isCoach: boolean;
  }) => {
    const { data: response } = await supabase
      .from('Teammates')
      .insert([
        {
          name,
          belt,
          is_coach: isCoach,
        },
      ])
      .select()
      .returns<
        {
          name: string;
          belt: Belt;
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
  };
};

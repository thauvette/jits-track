import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../useSupabase.ts';
import { useRolls } from '../useRolls/useRolls.ts';
import { SessionRequestBody, SessionResponseItem } from './types.ts';
import { formatSession } from './utils.ts';
import dayjs from 'dayjs';

export const useSessions = (props?: {
  id?: number;
  dateRange?: [string, string];
}) => {
  const { id, dateRange } = props ?? {};
  const { supabase } = useSupabase();
  const { data: rolls } = useRolls({ sessionId: id, dateRange: dateRange });
  const queryClient = useQueryClient();
  const queryKey: (string | number)[] = ['sessions'];
  if (id) {
    queryKey.push(id);
  }
  if (dateRange) {
    queryKey.push(...dateRange);
  }

  const { data, isLoading, error, refetch } = useQuery({
    staleTime: 1000 * 60 * 10,
    queryKey,
    queryFn: async () => {
      const query = supabase.from('Sessions').select(`*, Rolls(*)`);

      if (id) {
        query.eq('id', id);
      }

      if (dateRange) {
        query.gte('date', dateRange[0]);
        query.lte('date', dateRange[1]);
      }

      const { data: response } = await query.returns<SessionResponseItem[]>();

      return response?.map(formatSession);
    },
  });

  const createSession = async (
    req: SessionRequestBody,
    ignoreQueryInvalidation: boolean = false,
  ) => {
    const { data, error } = await supabase
      .from('Sessions')
      .insert(req)
      .select()
      .returns<SessionResponseItem[]>();

    if (data?.[0] && !ignoreQueryInvalidation) {
      await queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });
    }

    return { error, data: data?.[0] ? formatSession(data[0]) : null };
  };
  const updateSession = async (id: number, req: SessionRequestBody) => {
    const { data, error } = await supabase
      .from('Sessions')
      .update(req)
      .eq('id', id)
      .select()
      .returns<SessionResponseItem[]>();

    if (data?.[0]) {
      await queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });
    }

    return { error, data: data?.[0] ? formatSession(data[0]) : null };
  };
  const deleteSession = async (id: number) => {
    const { data, error } = await supabase
      .from('Sessions')
      .delete()
      .eq('id', id)
      .select();

    await queryClient.invalidateQueries({
      queryKey: ['sessions'],
    });
    return { data, error };
  };
  const hydratedSessions = data?.map((session) => {
    const sessionRolls = rolls?.filter((roll) => roll.session === session.id);
    return {
      ...session,
      rolls: sessionRolls,
    };
  });

  return {
    data: hydratedSessions?.sort((a, b) =>
      dayjs(b.date).isBefore(a.date) ? -1 : 1,
    ),
    isLoading,
    error,
    createSession,
    updateSession,
    refetch,
    deleteSession,
  };
};

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../useSupabase.ts';
import { useRolls } from '../useRolls.ts';
import { SessionRequestBody, SessionResponseItem } from './types.ts';
import { formatSession } from './utils.ts';

// TODO: add date range query
export const useSessions = (id?: number) => {
  const { supabase } = useSupabase();
  const { data: rolls } = useRolls({});
  const { data, isLoading, error, refetch } = useQuery({
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const query = supabase.from('Sessions').select(`*, Rolls(*)`);

      if (id) {
        query.eq('id', id);
      }

      const { data: response } = await query.returns<SessionResponseItem[]>();

      return response?.map(formatSession);
    },
    queryKey: ['sessions', id],
  });

  const createSession = async (req: SessionRequestBody) => {
    const { data, error } = await supabase
      .from('Sessions')
      .insert(req)
      .select()
      .returns<SessionResponseItem[]>();

    if (data?.[0]) {
      await refetch();
    }

    return { error, data: data?.[0] ? formatSession(data[0]) : null };
  };

  const hydratedSessions = data?.map((session) => {
    const sessionRolls = rolls?.filter((roll) => roll.session === session.id);
    return {
      ...session,
      rolls: sessionRolls,
    };
  });

  return {
    data: hydratedSessions,
    isLoading,
    error,
    createSession,
  };
};

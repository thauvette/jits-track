import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../useSupabase.ts';
import { belts } from '../../config/betls.ts';
import { FormattedReq, RollReq, RollRes, Roll } from './types.ts';
import { formatSubsRequest } from './utilities.ts';

const rollSelect = `*, Teammates(
            id, name, belt
        ), Subs_for(sub,roll,id, Subs(name)), Subs_against(sub,roll,id, Subs(name))`;

const formatRoll = (roll: RollReq) => {
  const result: FormattedReq = {
    teammate_id: roll.teammateId,
    date: roll.date,
    nogi: roll.nogi,
  };
  if (roll.session) {
    result.session = roll.session;
  }
  return result;
};

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
    queryFn: async (): Promise<Roll[] | undefined> => {
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
      const { data } = await query.returns<RollRes[]>();
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
            : undefined,
          subsFor: roll.Subs_for.map((sub) => ({
            id: sub.id,
            roll: sub.roll,
            sub: sub.sub,
            name: sub.Subs.name,
          })),
          subsAgainst: roll.Subs_against.map((sub) => ({
            id: sub.id,
            roll: sub.roll,
            sub: sub.sub,
            name: sub.Subs.name,
          })),
        }));
      }
    },
  });

  // TODO: update roll
  const addRoll = async (rolls: RollReq | RollReq[]) => {
    const req = Array.isArray(rolls)
      ? rolls.map(formatRoll)
      : formatRoll(rolls);
    const { data, error } = await supabase
      .from('Rolls')
      .insert(req)
      .select(rollSelect);
    if (data) {
      // array of sub and roll id's
      const subsFor = formatSubsRequest(rolls, 'subsFor', data);
      const subsAgainst = formatSubsRequest(rolls, 'subAgainst', data);
      const subPromises = [];
      if (subsFor?.length) {
        subPromises.push(supabase.from('Subs_for').insert(subsFor).select());
      }
      if (subsAgainst?.length) {
        subPromises.push(
          supabase.from('Subs_against').insert(subsAgainst).select(),
        );
      }

      if (subPromises?.length) {
        await Promise.allSettled(subPromises);
      }

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
      toast.error('NEWP');
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

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase.ts';
import toast from 'react-hot-toast';

export const useSubs = () => {
  const { supabase } = useSupabase();

  const getSubs = async () => {
    return supabase
      .from('Subs')
      .select('*')
      .returns<
        {
          name: string;
          id: number;
        }[]
      >()
      .then((res) => {
        return res?.data;
      });
  };
  const query = useQuery({
    queryKey: ['subs'],
    queryFn: getSubs,
    staleTime: Infinity,
  });

  const addSub = async (name: string) => {
    const { data, error } = await supabase
      .from('Subs')
      .insert({ name })
      .select()
      .returns<
        {
          name: string;
          id: number;
        }[]
      >();

    const sub = data?.[0];

    if (sub) {
      toast.success(`added ${name} to subs`);
      await query.refetch();
    }

    if (error) {
      toast.error(`Unable to ${name}`);
    }

    return { data: sub, error };
  };

  return {
    ...query,
    addSub,
  };
};

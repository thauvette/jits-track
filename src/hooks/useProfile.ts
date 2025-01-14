import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSupabase } from './useSupabase.ts';

export interface UserProfile {
  belt: number;
  display_name: string;
  default_round_length: number;
  id: number;
}

export const useProfile = () => {
  const { supabase, user } = useSupabase();
  const userId = user?.id;
  const fetchProfile = async (): Promise<UserProfile | null> => {
    return supabase
      .from('Profile')
      .select('*')
      .then((res) => {
        return res?.data?.[0] ?? null;
      });
  };
  const query = useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: fetchProfile,
    staleTime: Infinity,
  });

  const updateProfile = async (values: {
    belt: number;
    display_name: string;
    default_round_length: number;
  }) => {
    try {
      const request = supabase.from('Profile');
      let data;
      if (query.data?.id) {
        data = await request
          .update(values)
          .eq('id', +query.data.id)
          .select('*');
      } else {
        data = await request.insert(values).select('*');
      }

      if (data) {
        toast.success('Profile updated successfully.');
        await query.refetch();
      }
    } catch (error) {
      let message = 'Error updating profile';
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  return {
    ...query,
    updateProfile,
  };
};

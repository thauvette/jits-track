import { useEffect, useState } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUB_KEY,
);

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    await queryClient.resetQueries();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    await queryClient.resetQueries();
    setIsLoading(false);
    return {
      error,
      data,
    };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.window.origin}/reset-password`,
    });

    return {
      data,
      error,
    };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    return {
      data,
      error,
    };
  };

  return {
    session,
    supabase,
    logout,
    login,
    resetPassword,
    updatePassword,
    isAuthenticated: !!session?.user,
    user: session?.user ?? null,
    isLoading,
  };
};

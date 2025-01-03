import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useSupabase } from '../hooks/useSupabase.ts';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

export const LoginForm = () => {
  const { login, resetPassword } = useSupabase();
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [state, setState] = useState<{
    isLoading: boolean;
    error: null | string;
  }>({
    isLoading: false,
    error: null,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.target instanceof HTMLFormElement) {
      const data = new FormData(event.target);
      const email = data.get('email');
      const password = data.get('password');
      if (typeof email === 'string' && typeof password === 'string') {
        setState({
          isLoading: true,
          error: null,
        });
        const { error } = await login(email, password);
        setState({
          isLoading: false,
          error: error?.message ?? null,
        });
      }
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({
      isLoading: true,
      error: null,
    });
    if (event.target instanceof HTMLFormElement) {
      const data = new FormData(event.target);
      const email = data.get('email');
      if (email && typeof email === 'string') {
        const { error } = await resetPassword(email);
        setState({
          isLoading: false,
          error: error?.message ?? null,
        });
        if (!error) {
          toast('reset password link sent');
        }
      }
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  return view === 'login' ? (
    <>
      <form onSubmit={handleSubmit} className={'p-4 flex flex-col gap-4'}>
        <label>
          <p>Email</p>
          <input className={'w-full'} name={'email'} type={'email'} required />
        </label>
        <label className={'block '}>
          <p>Password</p>
          <div className={'relative'}>
            <input
              name={'password'}
              type={showPassword ? 'text' : 'password'}
              required
              className={'w-full'}
            />
            <button
              type={'button'}
              className={'absolute right-2 top-1/2 transform -translate-y-1/2'}
              onClick={(event) => {
                event.stopPropagation();
                setShowPassword(!showPassword);
              }}
              aria-label={showPassword ? 'hide password' : 'show password'}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
        </label>

        <div className={'pt-4'}>
          {state.error && <p>{state.error}</p>}
          <button className={'primary w-full'} type='submit'>
            Login
          </button>
        </div>
      </form>
      <div className={'px-4'}>
        <button className={'underline'} onClick={() => setView('forgot')}>
          Forgot password?
        </button>
      </div>
    </>
  ) : (
    <form onSubmit={handleResetPassword} className={'p-4'}>
      <h1 className={'mb-2 text-lg font-bold'}>Reset password</h1>
      <label>
        <p>Email:</p>
        <input name={'email'} type={'email'} required />
      </label>
      <div className={'my-4'}>
        <button className={'primary'}>Send reset link</button>
      </div>
      <button className={'underline'} onClick={() => setView('login')}>
        Back to login
      </button>
    </form>
  );
};

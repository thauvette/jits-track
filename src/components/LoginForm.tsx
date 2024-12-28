import { FormEvent, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase.ts';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

export const LoginForm = () => {
  const { login } = useSupabase();
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <form onSubmit={handleSubmit} className={'p-4'}>
      <label>
        <p>Email</p>
        <input name={'email'} type={'email'} required />
      </label>
      <label className={'block '}>
        <p>Password</p>
        <div className={'relative'}>
          <input
            name={'password'}
            type={showPassword ? 'text' : 'password'}
            required
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
  );
};

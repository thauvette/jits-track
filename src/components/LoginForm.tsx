import { FormEvent, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase.ts';

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
    <form onSubmit={handleSubmit}>
      <label>
        <p>Email</p>
        <input name={'email'} type={'email'} required />
      </label>
      <label className={'block'}>
        <p>Password</p>
        <input
          name={'password'}
          type={showPassword ? 'text' : 'password'}
          required
        />
      </label>
      <button
        type={'button'}
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        aria-label={showPassword ? 'hide password' : 'show password'}
      >
        Eye Icon
      </button>
      <div>
        {state.error && <p>{state.error}</p>}
        <button type='submit'>Login</button>
      </div>
    </form>
  );
};

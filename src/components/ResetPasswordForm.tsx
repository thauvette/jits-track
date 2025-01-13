import { FormEvent, useState } from 'react';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useSupabase } from '../hooks/useSupabase.ts';
import { useNavigate } from 'react-router';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword } = useSupabase();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (event.target instanceof HTMLFormElement) {
      const data = new FormData(event.target);
      const password = data.get('password');
      if (password && typeof password === 'string') {
        const { error } = await updatePassword(password);
        if (!error) {
          navigate('/');
          return;
        }
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          <p>New Password</p>
          <div className='relative'>
            <input
              name={'password'}
              type={showPassword ? 'text' : 'password'}
              placeholder={'***'}
            />
            <button
              type={'button'}
              className={'absolute top-1/2 right-2 transform -translate-y-1/2'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
        </label>
        <div className={'pt-4'}>
          <button type={'submit'} className={'primary'}>
            Update
          </button>
          {error && <p className={'mt-2'}>{error}</p>}
        </div>
      </form>
    </div>
  );
};

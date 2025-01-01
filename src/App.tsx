import { Route, Routes } from 'react-router';
import './App.css';
import { Router } from './routes/Router.tsx';
import { LoginForm } from './components/LoginForm.tsx';
import { useSupabase } from './hooks/useSupabase.ts';
import { Header } from './components/Header.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ResetPasswordForm } from './components/ResetPasswordForm.tsx';

function App() {
  const { isAuthenticated, isLoading } = useSupabase();

  if (isLoading) {
    return (
      <div className={'flex items-center justify-center py-8'}>
        <LoadingSpinner className={'size-10'} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='max-w-2xl py-8 mx-auto'>
        <LoginForm />
      </div>
    );
  }

  return (
    <Routes>
      <Route path={'reset-password'} element={<ResetPasswordForm />} />
      <Route
        path={'*'}
        element={
          <>
            <Header />
            <div className={'max-content'}>
              <Router />
            </div>
          </>
        }
      />
    </Routes>
  );
}

export default App;

import './App.css';
import { Router } from './routes/Router.tsx';
import { LoginForm } from './components/LoginForm.tsx';
import { useSupabase } from './hooks/useSupabase.ts';
import { Header } from './components/Header.tsx';

function App() {
  const { isAuthenticated, isLoading } = useSupabase();

  if (isLoading) {
    return (
      <div>
        <p>TODO: loading</p>
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
    <>
      <Header />
      <Router />
    </>
  );
}

export default App;

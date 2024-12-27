import { Routes, Route, Link } from 'react-router';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { SessionRoutes } from './sessions/SessionRoutes.tsx';

export const Router = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <>
            <h1>TODO: home page</h1>
            <Link to={'sessions'} className={'flex items-center gap-2'}>
              Sessions <ArrowRightIcon className={'size-4'} />{' '}
            </Link>
          </>
        }
      />

      <Route path={'sessions/*'} element={<SessionRoutes />} />
      <Route path={'*'} element={<h1>404</h1>} />
    </Routes>
  );
};

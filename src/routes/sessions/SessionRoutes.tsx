import { Link, Route, Routes, useNavigate } from 'react-router';
import dayjs from 'dayjs';

import { SessionForm } from '../../components/SessionForm.tsx';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { Session } from './Session.tsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';

export const SessionRoutes = () => {
  const { data: sessions, isLoading } = useSessions();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={'/'}
        index
        element={
          <div className={'p-4'}>
            <h1 className={'my-4 text-xl font-bold'}>Sessions</h1>
            <Link to={'create'} className={'primary'}>
              + Add New
            </Link>
            {isLoading && (
              <div className={'flex items-center justify-center p-4'}>
                <LoadingSpinner className={'size-8'} />
              </div>
            )}

            {sessions?.map((session) => {
              return (
                <div key={session.id} className='my-4 border-b'>
                  <Link to={`${session.id}`}>
                    {dayjs(session.date).format('dddD, MMMM, DD YYYY')}
                  </Link>
                  <p>
                    {session.rolls
                      ?.map((roll) => roll.teammate?.name ?? '')
                      .join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        }
      />
      <Route path={'/:id'} element={<Session />} />
      <Route
        path={'/create'}
        element={
          <div className={'p-4'}>
            <SessionForm
              onSuccess={(result) => {
                navigate(`/sessions/${result.id}`);
              }}
            />
          </div>
        }
      />
    </Routes>
  );
};

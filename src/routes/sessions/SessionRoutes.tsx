import { Link, Route, Routes, useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { ArrowRightIcon } from '@radix-ui/react-icons';

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
            <div className={'mb-4 flex items-center justify-between'}>
              <h1 className={'text-xl font-bold'}>Sessions</h1>
              <Link to={'create'} className={'underline'}>
                + Add New
              </Link>
            </div>
            {isLoading && (
              <div className={'flex items-center justify-center p-4'}>
                <LoadingSpinner className={'size-8'} />
              </div>
            )}

            {sessions?.map((session) => {
              return (
                <div key={session.id} className='my-4 border-b'>
                  <p className={'text-sm'}>{session.type}</p>
                  <Link
                    to={`${session.id}`}
                    className={
                      'underline text-lg font-bold flex items-center gap-2'
                    }
                  >
                    {dayjs(session.date).format('dddd, MMMM DD YYYY')}
                    <ArrowRightIcon className={'size-5'} />
                  </Link>

                  <p>
                    Rolls:{' '}
                    {session.rolls
                      ?.map((roll) => roll.teammate?.name ?? '')
                      .join(', ') || 'None logged'}
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

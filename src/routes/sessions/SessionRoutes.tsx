import { Link, Route, Routes, useNavigate } from 'react-router';
import { SessionForm } from '../../components/SessionForm.tsx';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import dayjs from 'dayjs';
import { Session } from './Session.tsx';
// import { Session } from './Session.tsx';

export const SessionRoutes = () => {
  const { data: sessions, isLoading } = useSessions();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <>
            <h1>Sessions</h1>
            <Link to={'create'}>+ Add New</Link>
            {isLoading && <p>Loading...</p>}

            {sessions?.map((session) => {
              return (
                <div key={session.id} className='my-4 border-b'>
                  <Link to={`${session.id}`}>
                    {dayjs(session.date).format('dddD, MMMM, DD YYYY')}
                  </Link>
                  <p>
                    {session.rollCount} roll{session.rollCount > 1 ? 's' : ''}
                  </p>
                  <p>
                    {session.rolls
                      ?.map((roll) => roll.teammate?.name ?? '')
                      .join(', ')}
                  </p>
                </div>
              );
            })}
          </>
        }
      />
      <Route path={'/:id'} element={<Session />} />
      <Route
        path={'create'}
        element={
          <div className={'p-4'}>
            <SessionForm
              onSuccess={(result) => {
                navigate(`${result.id}`);
              }}
            />
          </div>
        }
      />
    </Routes>
  );
};

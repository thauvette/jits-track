import { Link, Route, Routes, useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

import { SessionForm } from '../../components/SessionForm.tsx';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { Session } from './Session.tsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { DatesHeader } from '../../components/DatesHeader.tsx';
import { ImportSessions } from './ImportSessions/ImportSessions.tsx';

export const SessionRoutes = ({
  dates,
  setDates,
  updateRange,
}: {
  dates: {
    start: Dayjs;
    end: Dayjs;
    range: 'week' | 'month' | 'year';
  };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
  updateRange: (range: 'week' | 'month' | 'year') => void;
}) => {
  const { data: sessions, isLoading } = useSessions({
    dateRange: [
      dates.start.format('YYYY-MM-DD'),
      dates.end.format('YYYY-MM-DD'),
    ],
  });
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={'/'}
        index
        element={
          <>
            <DatesHeader
              dates={dates}
              setDates={setDates}
              updateRange={updateRange}
            />
            <div className={'p-4'}>
              <div className={'flex items-center justify-between'}>
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
                  <div key={session.id} className='my-4 card p-4'>
                    <p className={'text-sm'}>
                      {session.nogi ? 'nogi' : 'gi'} {session.type ?? ''}
                    </p>
                    <Link
                      to={`${session.id}`}
                      className={
                        'underline pl-0 font-bold flex items-center gap-2'
                      }
                    >
                      {dayjs(session.date).format('dddd, MMMM DD YYYY')}
                      <ArrowRightIcon className={'size-5'} />
                    </Link>
                    <p>Roll Count: {session.rollCount}</p>
                    <p>
                      Logged Rolls:{' '}
                      {session.rolls
                        ?.map((roll) => `${roll.teammate?.name ?? 'Unknown'}`)
                        .join(', ') || 'None logged'}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        }
      />
      <Route
        path={'/:id'}
        element={
          <div className={'p-4'}>
            <Link to={'/sessions'} className={'flex gap-2 items-center'}>
              <ArrowLeftIcon /> Sessions
            </Link>
            <div className={'max-w-2xl  py-4'}>
              <Session />
            </div>
          </div>
        }
      />
      <Route
        path={'/create'}
        element={
          <div className={'p-4'}>
            <Link to={'/sessions'} className={'flex gap-2 items-center'}>
              <ArrowLeftIcon /> Sessions
            </Link>
            <SessionForm
              onSuccess={(result) => {
                navigate(`/sessions/${result.id}`);
              }}
            />
          </div>
        }
      />
      <Route
        path={'import'}
        element={
          <div className={'p-4'}>
            <Link to={'/sessions'} className={'flex gap-2 items-center'}>
              <ArrowLeftIcon /> Sessions
            </Link>
            <ImportSessions />
          </div>
        }
      />
    </Routes>
  );
};

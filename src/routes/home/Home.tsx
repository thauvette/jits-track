import { Link } from 'react-router';
import { Dayjs } from 'dayjs';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { DatesHeader } from '../../components/DatesHeader.tsx';

export const Home = ({
  dates,
  setDates,
}: {
  dates: {
    start: Dayjs;
    end: Dayjs;
  };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
}) => {
  const { data: sessions, isLoading } = useSessions({
    dateRange: [
      dates.start.format('YYYY-MM-DD'),
      dates.end.format('YYYY-MM-DD'),
    ],
  });
  const rollCount =
    sessions?.reduce((num, { rolls }) => {
      return num + (rolls?.length ?? 0);
    }, 0) || 0;

  return (
    <>
      <DatesHeader dates={dates} setDates={setDates} />
      <div className={'p-4'}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={'space-y-4 divide-y'}>
            <div className={'flex items-center '}>
              {sessions?.length ? (
                <p>
                  {sessions.length} session{sessions.length > 1 ? 's' : ''}
                </p>
              ) : (
                <p>No sessions</p>
              )}
              <Link
                to={'sessions'}
                className={'flex items-center gap-2 ml-auto'}
              >
                Sessions <ArrowRightIcon className={'size-4'} />{' '}
              </Link>
            </div>
            <div className={'flex items-center '}>
              <p>
                {rollCount} roll{rollCount === 1 ? '' : 's'}
              </p>
              <Link to={'rolls'} className={'flex items-center gap-2 ml-auto'}>
                Rolls <ArrowRightIcon className={'size-4'} />{' '}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

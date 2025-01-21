import dayjs, { Dayjs } from 'dayjs';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { Group } from './Group.tsx';
import { DatesHeader } from '../../components/DatesHeader.tsx';
import { HydratedSession } from '../../hooks/useSessions/types.ts';

export const Stats = ({
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
  const { data, isLoading } = useSessions({
    dateRange: [
      dates.start.format('YYYY-MM-DD'),
      dates.end.format('YYYY-MM-DD'),
    ],
  });

  const weekDates =
    isLoading || dates.range === 'week'
      ? null
      : Array.from({
          length: dates.end.diff(dates.start.startOf('week'), 'weeks') + 1,
        }).map((_, index) => {
          const nextStart = dates.start.add(index, 'weeks').startOf('week');
          const nextEnd = nextStart.endOf('week');
          const start = nextStart.isAfter(dates.start)
            ? nextStart
            : dates.start;
          const end = nextEnd.isBefore(dates.end) ? nextEnd : dates.end;
          return {
            start,
            end,
            totalDays: end.diff(start, 'days') + 1,
          };
        });

  const groupedSessions =
    isLoading || dates.range === 'week'
      ? null
      : data?.reduce<{
          [key: string]: HydratedSession[];
        }>((obj, session) => {
          const weekStart = dayjs(session.date).startOf('week');
          const weekKey = weekStart.isAfter(dates.start)
            ? weekStart.format('YYYY-MM-DD')
            : dates.start.format('YYYY-MM-DD');
          const current = obj[weekKey] || [];
          current.push(session);
          return {
            ...obj,
            [weekKey]: current,
          };
        }, {});

  const weeks = weekDates?.map((dates) => {
    const key = dates.start.format('YYYY-MM-DD');
    const sessions = groupedSessions?.[key] || [];
    return {
      ...dates,
      sessions,
    };
  });

  return (
    <div className={''}>
      <DatesHeader
        dates={dates}
        setDates={setDates}
        updateRange={updateRange}
      />

      {isLoading ? (
        <div className={'flex items-center justify-center'}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={'p-4'}>
          <Group start={dates.start} end={dates.end} sessions={data ?? []} />
          {dates.range === 'week' ? null : (
            <>
              <h2 className={'my-4 font-bold'}>Numbers by week.</h2>
              {weeks?.map((week) => (
                <div className={'mb-4 '} key={week.start.format()}>
                  <Group {...week} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

import dayjs, { Dayjs } from 'dayjs';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { Group } from './Group.tsx';
import { DatesHeader } from '../../components/DatesHeader.tsx';

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

  const weeks = isLoading
    ? null
    : Array.from({
        length: dates.end.diff(dates.start, 'weeks') + 1,
      })
        .map((_, index) => {
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
        })
        .map((week) => {
          return {
            ...week,
            sessions:
              data?.filter(({ date }) => {
                return (
                  dayjs(date).isSameOrAfter(week.start) &&
                  dayjs(date).isSameOrBefore(week.end)
                );
              }) ?? [],
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
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={'p-4'}>
          <Group start={dates.start} end={dates.end} sessions={data ?? []} />
          <h2 className={'my-4 font-bold'}>Numbers by week.</h2>
          {weeks?.map((week) => (
            <div className={'mb-4 '} key={week.start.format()}>
              <Group {...week} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

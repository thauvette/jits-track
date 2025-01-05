import { useState } from 'react';
import dayjs from 'dayjs';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { Group } from './Group.tsx';

export const Stats = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [range, setRange] = useState<'month' | 'year'>('month');
  const endDate = startDate.endOf(range);

  const { data, isLoading } = useSessions({
    dateRange: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')],
  });

  const jumpDates = (amount: 1 | -1) => {
    const start = startDate.add(amount, range);
    setStartDate(start);
  };

  const changeRange = (value: 'month' | 'year') => {
    setRange(value);
    setStartDate(dayjs().startOf(value));
  };

  const weeks = isLoading
    ? null
    : Array.from({
        length: endDate.diff(startDate, 'weeks') + 1,
      })
        .map((_, index) => {
          // start is greater of startDate and startDate.startOfWeek
          const nextStart = startDate.add(index, 'weeks').startOf('week');
          const nextEnd = nextStart.endOf('week');

          const start = nextStart.isAfter(startDate) ? nextStart : startDate;

          const end = nextEnd.isBefore(endDate) ? nextEnd : endDate;
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
    <div className={'pt-4'}>
      <div className='flex flex-col p-4'>
        <p>Range</p>
        <select
          value={range}
          onChange={(event) => {
            if (
              event.target.value === 'month' ||
              event.target.value === 'year'
            ) {
              changeRange(event.target.value);
            }
          }}
        >
          <option value={'month'}>Month</option>
          <option value={'year'}>Year</option>
        </select>
      </div>
      <div className='flex mb-2 items-center gap-4 justify-center md:text-lg font-bold'>
        <button
          onClick={() => {
            jumpDates(-1);
          }}
        >
          <span className={'sr-only'}>Previous {range}</span>
          <ArrowLeftIcon className={'size-4'} />
        </button>
        <p>
          {range === 'month'
            ? startDate.format('MMMM YYYY')
            : startDate.format('YYYY')}
        </p>
        <button
          onClick={() => {
            jumpDates(1);
          }}
        >
          <span className={'sr-only'}>Next {range}</span>
          <ArrowRightIcon className={'size-4'} />
        </button>
      </div>

      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={'p-4'}>
          <Group start={startDate} end={endDate} sessions={data ?? []} />
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

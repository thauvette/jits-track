import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import { Roll, useRolls } from '../../hooks/useRolls.ts';
import { DatesHeader } from '../../components/DatesHeader.tsx';

export const Rolls = ({
  dates,
  setDates,
  updateRange,
}: {
  dates: { start: Dayjs; end: Dayjs; range: 'week' | 'month' | 'year' };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
  updateRange: (range: 'week' | 'month' | 'year') => void;
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'belts' | 'teammate'>('date');
  const { data: rolls } = useRolls({
    dateRange: [
      dates.start.format('YYYY-MM-DD'),
      dates.end.format('YYYY-MM-DD'),
    ],
  });

  const grouped = useMemo(() => {
    return rolls?.reduce<{
      teammate: {
        [key: string]: Roll[];
      };
      date: {
        [key: string]: Roll[];
      };
      belts: {
        [key: string]: Roll[];
      };
    }>(
      (obj, roll) => {
        const { date, teammate } = roll;
        const teamKey = teammate?.name ?? 'notListed';
        const currentTeam = obj.teammate[teamKey] || [];
        currentTeam.push(roll);
        const dateKey = dayjs(date).format('ddd MMM DD YYYY');
        const currentDate = obj.date[dateKey] ?? [];
        currentDate.push(roll);
        const beltKey = teammate?.beltName ?? 'notListed';
        const currentBelt = obj.belts[beltKey] || [];
        currentBelt.push(roll);

        return {
          ...obj,
          teammate: {
            ...obj.teammate,
            [teamKey]: currentTeam,
          },
          date: {
            ...obj.date,
            [dateKey]: currentDate,
          },
          belts: {
            ...obj.belts,
            [beltKey]: currentBelt,
          },
        };
      },
      {
        teammate: {},
        date: {},
        belts: {},
      },
    );
  }, [rolls]);

  const data = grouped?.[sortBy];

  const sortOptions: ('date' | 'belts' | 'teammate')[] = [
    'date',
    'belts',
    'teammate',
  ];
  return (
    <>
      <DatesHeader
        dates={dates}
        setDates={setDates}
        updateRange={updateRange}
      />
      <div className={'p-4'}>
        <p className={'text-lg font-bold'}>Rolls</p>
        <p>Sort by:</p>
        <div className='flex gap-4 mb-4'>
          {sortOptions.map((type) => (
            <button
              key={type}
              className={`capitalize border-b-2 px-2 ${type === sortBy ? 'border-black' : ''}`}
              onClick={() => setSortBy(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {data && Object.keys(data)?.length
          ? Object.entries(data).map(([key, items]) => (
              <div key={key}>
                <p className='capitalize'>
                  {key}: {items.length}
                </p>
              </div>
            ))
          : null}
      </div>
    </>
  );
};

import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import { Roll, useRolls } from '../../hooks/useRolls.ts';
import { DatesHeader } from '../../components/DatesHeader.tsx';
import { SelectableButtonList } from '../../components/ButtonList.tsx';

const sortOptions: ('week' | 'belts' | 'teammate')[] = [
  'week',
  'belts',
  'teammate',
];

export const Rolls = ({
  dates,
  setDates,
  updateRange,
}: {
  dates: { start: Dayjs; end: Dayjs; range: 'week' | 'month' | 'year' };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
  updateRange: (range: 'week' | 'month' | 'year') => void;
}) => {
  const [sortBy, setSortBy] = useState<'week' | 'belts' | 'teammate'>('week');
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
      week: {
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
        const dateKey = dayjs(date).startOf('week').format('ddd MMM DD YYYY');
        const currentDate = obj.week[dateKey] ?? [];
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
          week: {
            ...obj.week,
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
        week: {},
        belts: {},
      },
    );
  }, [rolls]);

  const data = grouped?.[sortBy];

  const sortedKey =
    sortBy === 'week'
      ? Object.keys(data || {}).sort((a, b) =>
          dayjs(b).isBefore(dayjs(a)) ? -1 : 1,
        )
      : Object.entries(data || {})
          .sort(([, aRolls], [, bRolls]) =>
            aRolls.length < bRolls.length ? 1 : -1,
          )
          .map((entry) => entry[0]);

  return (
    <>
      <DatesHeader
        dates={dates}
        setDates={setDates}
        updateRange={updateRange}
      />
      <div className={'p-4'}>
        <p className={'text-lg font-bold'}>Rolls</p>
        <p className={'mb-2'}>Sort by:</p>

        <div className='mb-4'>
          <SelectableButtonList
            buttons={sortOptions.map((type) => ({
              label: type,
              value: type,
              onClick: () => setSortBy(type),
              isSelected: type === sortBy,
            }))}
          />
        </div>

        {sortedKey?.length
          ? sortedKey.map((key) => {
              const item = data?.[key];
              return item ? (
                <div key={key}>
                  <p className='capitalize'>
                    {key}: {item.length}
                  </p>
                </div>
              ) : null;
            })
          : null}
      </div>
    </>
  );
};

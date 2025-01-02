import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Routes, Route } from 'react-router';
import { SessionRoutes } from './sessions/SessionRoutes.tsx';
import { Home } from './home/Home.tsx';
import { Rolls } from './rolls/Rolls.tsx';
import { TeamRoutes } from './team/TeamRoutes.tsx';

export const Router = () => {
  const [dates, setDates] = useState<{
    start: Dayjs;
    end: Dayjs;
    range: 'week' | 'month' | 'year';
  }>({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
    range: 'month',
  });

  const updateRange = (range: 'week' | 'month' | 'year') => {
    const start = dayjs().startOf(range);
    const end = dayjs().endOf(range);
    setDates({
      start,
      end,
      range,
    });
  };

  const updateDates = ({ start, end }: { start: Dayjs; end: Dayjs }) => {
    setDates((current) => ({
      ...current,
      start,
      end,
    }));
  };

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <Home
              dates={dates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route
          path={'sessions/*'}
          element={
            <SessionRoutes
              dates={dates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route
          path={'rolls/*'}
          element={
            <Rolls
              dates={dates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route path={'team/*'} element={<TeamRoutes />} />
        <Route path={'*'} element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

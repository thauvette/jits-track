import { useState } from 'react';
import dayjs from 'dayjs';
import { Routes, Route } from 'react-router';
import { SessionRoutes } from './sessions/SessionRoutes.tsx';
import { Home } from './home/Home.tsx';
import { Rolls } from './rolls/Rolls.tsx';
import { TeamRoutes } from './team/TeamRoutes.tsx';

export const Router = () => {
  const [dates, setDates] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  });

  return (
    <>
      <Routes>
        <Route index element={<Home dates={dates} setDates={setDates} />} />
        <Route
          path={'sessions/*'}
          element={<SessionRoutes dates={dates} setDates={setDates} />}
        />
        <Route
          path={'rolls/*'}
          element={<Rolls dates={dates} setDates={setDates} />}
        />
        <Route path={'team/*'} element={<TeamRoutes />} />
        <Route path={'*'} element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

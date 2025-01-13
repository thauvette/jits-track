import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Routes, Route } from 'react-router';
import { SessionRoutes } from './sessions/SessionRoutes.tsx';
import { Rolls } from './rolls/Rolls.tsx';
import { TeamRoutes } from './team/TeamRoutes.tsx';
import { Stats } from './stats/Stats.tsx';
import { useProfile } from '../hooks/useProfile.ts';
import { useSupabase } from '../hooks/useSupabase.ts';
import { ProfileForm } from '../components/ProfileForm.tsx';
import { Profile } from './profile/Profile.tsx';

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
  const { user } = useSupabase();
  const { data: profile, isLoading } = useProfile();

  const showMissingProfileWarning = !!user?.id && !isLoading && !profile;

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

  const formattedDates = useMemo(
    () => ({
      ...dates,
      end: dates.end.isBefore(dayjs()) ? dates.end : dayjs(),
    }),
    [dates],
  );

  return showMissingProfileWarning ? (
    <div className={'pt-8 max-w-2xl'}>
      <h1 className={'text-lg '}>We need to quickly set up your profile.</h1>
      <ProfileForm />
    </div>
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <Stats
              dates={formattedDates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route
          path={'sessions/*'}
          element={
            <SessionRoutes
              dates={formattedDates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route
          path={'rolls/*'}
          element={
            <Rolls
              dates={formattedDates}
              updateRange={updateRange}
              setDates={updateDates}
            />
          }
        />
        <Route path={'team/*'} element={<TeamRoutes />} />
        <Route path={'profile'} element={<Profile />} />
        <Route path={'*'} element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

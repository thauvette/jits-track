import { Dayjs } from 'dayjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { HydratedSession } from '../../hooks/useSessions/types.ts';
import { convertSecondsToDuration } from '../../utilities/duration.tsx';

// @ts-expect-error swiper issue
import 'swiper/css/pagination';

import { getAverage } from './utils.ts';
import { Roll } from '../../hooks/useRolls.ts';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const slideClassNames = 'pt-4 pb-8 px-2 !h-auto';
const slideInnerClassNames = 'bg-blue-100 h-full p-4';

export const Group = ({
  sessions,
  start,
  end,
}: {
  sessions: HydratedSession[];
  start: Dayjs;
  end: Dayjs;
}) => {
  const totalDays = end.diff(start, 'days') + 1;

  const data = sessions.reduce<{
    loggedNogiRolls: number;
    loggedRollTotal: number;
    loggedRolls: Roll[];
    noGiSessions: number;
    rollTotal: number;
    totalCalories: number;
    totalDuration: number;
    heartRates: number[];
    calories: number[];
    durations: number[];
  }>(
    (obj, session) => {
      const rolls = session?.rolls ?? [];
      return {
        loggedNogiRolls:
          obj.loggedNogiRolls + rolls.filter(({ nogi }) => !!nogi).length,
        loggedRollTotal: obj.loggedRollTotal + rolls.length,
        noGiSessions: obj.noGiSessions + (session.nogi ? 1 : 0),
        rollTotal: obj.rollTotal + (session.rollCount ?? 0),
        totalCalories: obj.totalCalories + (session.calories ?? 0),
        calories: session.calories
          ? [...obj.calories, session.calories]
          : obj.calories,
        totalDuration: obj.totalDuration + (session.durationSeconds ?? 0),
        durations: session?.durationSeconds
          ? [...obj.durations, session.durationSeconds]
          : obj.durations,
        heartRates: session?.avgHeartRate
          ? [...obj.heartRates, session.avgHeartRate]
          : obj.heartRates,
        loggedRolls: session?.rolls
          ? [...obj.loggedRolls, ...session.rolls]
          : obj.loggedRolls,
      };
    },
    {
      loggedNogiRolls: 0,
      loggedRollTotal: 0,
      noGiSessions: 0,
      rollTotal: 0,
      totalCalories: 0,
      totalDuration: 0,
      heartRates: [],
      calories: [],
      durations: [],
      loggedRolls: [],
    },
  );

  const trainedPercentage = Math.round((sessions.length / totalDays) * 100);
  return (
    <div>
      <p className={'font-bold'}>
        {start.format('ddd MMM DD')}
        {' to '}
        {end.format('ddd MMM DD')}
      </p>

      <div className={'pb-4 border-b'}>
        <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
          <SwiperSlide className={slideClassNames}>
            <div className={slideInnerClassNames + ' flex flex-col'}>
              <p>
                Sessions: {sessions.length} in {totalDays} days.{' '}
                {trainedPercentage}%
              </p>
              <p>Total time: {convertSecondsToDuration(data.totalDuration)}</p>
              <div className={'flex justify-end mt-auto'}>
                <Link
                  to={'/sessions'}
                  className={'underline flex gap-1 items-center'}
                >
                  Sessions <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className={slideClassNames}>
            <div className={slideInnerClassNames + ' flex flex-col'}>
              <p>Roll count: {data.rollTotal}</p>
              <p>Logged Rolls: {data.loggedRollTotal}</p>
              <p>
                gi: {data.loggedRollTotal - data.loggedNogiRolls} |{' '}
                {data.loggedRollTotal && data.loggedNogiRolls
                  ? Math.round(
                      ((data.loggedRollTotal - data.loggedNogiRolls) /
                        data.loggedRollTotal) *
                        100,
                    )
                  : '0'}
                %{' '}
              </p>
              <p>
                nogi: {data.loggedNogiRolls}
                {' | '}
                {data.loggedNogiRolls && data.loggedRollTotal
                  ? Math.round(
                      (data.loggedNogiRolls / data.loggedRollTotal) * 100,
                    )
                  : 0}
                %
              </p>
              <div className={'flex justify-end mt-auto'}>
                <Link
                  to={'/rolls'}
                  className={'underline flex gap-1 items-center'}
                >
                  Rolls <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className={slideClassNames}>
            <div className={slideInnerClassNames + ' flex flex-col'}>
              {data.loggedRolls?.length ? (
                <RollData rolls={data.loggedRolls} />
              ) : (
                <p className={''}>No Logged roll data</p>
              )}
              <div className={'flex justify-end mt-auto'}>
                <Link
                  to={'/rolls'}
                  className={'underline flex gap-1 items-center'}
                >
                  Rolls <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className={slideClassNames}>
            <div className={slideInnerClassNames}>
              <p>Total calories: {data.totalCalories}</p>
              <p>Average Cals per Session: {getAverage(data.calories)}</p>
              <p>Average Heart Rate: {getAverage(data.heartRates)}</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

const RollData = ({ rolls }: { rolls: Roll[] }) => {
  const data = rolls.reduce<{
    team: {
      [key: string]: Roll[];
    };
    belt: {
      [key: string]: Roll[];
    };
  }>(
    (obj, roll) => {
      const teamKey = roll.teammate?.name ?? 'unknown';
      const beltKey = roll.teammate?.beltName ?? 'unknown';

      const currentTeam = obj.team?.[teamKey] ?? [];
      currentTeam.push(roll);
      const currentBelt = obj.belt?.[beltKey] ?? [];
      currentBelt.push(roll);
      return {
        ...obj,
        team: {
          ...obj.team,
          [teamKey]: currentTeam,
        },
        belt: {
          ...obj.belt,
          [beltKey]: currentBelt,
        },
      };
    },
    {
      team: {},
      belt: {},
    },
  );

  return (
    <div className={''}>
      <p>Rolls by belt</p>
      <p className={'capitalize'}>
        {Object.entries(data.belt)
          .map(([belt, items]) => `${belt}: ${items.length}`)
          .join(', ')}
      </p>
    </div>
  );
};

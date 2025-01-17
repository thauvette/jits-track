import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  PlusIcon,
  Cross1Icon,
  ClockIcon,
  BarChartIcon,
} from '@radix-ui/react-icons';

import HeartRateIcon from '../../assets/icons/heart-rate-outline.svg?react';
import ChartIcon from '../../assets/icons/pulse-outline.svg?react';

import { useRolls } from '../../hooks/useRolls/useRolls.ts';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { AddRollForm } from '../../components/AddRollForm.tsx';
import { convertSecondsToDuration } from '../../utilities/duration.tsx';
import { SessionForm } from '../../components/SessionForm.tsx';
import { useTeammates } from '../../hooks/useTeammates.ts';
import { Modal } from '../../components/Modal.tsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { StatLine } from './components/StatLine.tsx';
import { SessionHeader } from './components/SessionHeader.tsx';

export const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: rolls, removeRoll } = useRolls({
    sessionId: id ? +id : undefined,
  });
  const {
    data: sessions,
    isLoading,
    refetch,
    deleteSession,
  } = useSessions({ id: id ? +id : undefined });
  const { data: teammates } = useTeammates();
  const session = sessions?.[0];
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleDelete = async (callback: () => void) => {
    // delete
    if (!id) {
      return;
    }
    await deleteSession(+id);
    // close modal
    await refetch();
    callback();
    navigate('/sessions');
  };

  if (isLoading) {
    return (
      <div className={'p-4 flex items-center justify-center'}>
        <LoadingSpinner className={'size-10'} />
      </div>
    );
  }

  if (!session && !isLoading) {
    return <div>404</div>;
  }

  if (mode == 'edit') {
    return (
      <div className={'p-4 '}>
        <button
          onClick={() => setMode('view')}
          className={'underline flex gap-2 items-center'}
        >
          <Cross1Icon />
          Cancel
        </button>
        <SessionForm
          onSuccess={async () => {
            await refetch();
            setMode('view');
          }}
          initialValues={{
            date: session?.date,
            duration: session?.durationSeconds
              ? convertSecondsToDuration(session.durationSeconds)
              : undefined,
            coach: session?.coach ?? undefined,
            avg_heart_rate: session?.avgHeartRate ?? undefined,
            calories: session?.calories ?? undefined,
            rollCount: session?.rollCount,
            type: session?.type ?? '',
            notes: session?.notes ?? '',
            nogi: !!session?.nogi,
          }}
          id={session?.id}
        />
      </div>
    );
  }
  const coach =
    session?.coach && teammates?.length
      ? teammates.find(({ id }) => id === session.coach)
      : null;

  return (
    <>
      <SessionHeader
        handleDelete={handleDelete}
        handleEdit={() => setMode('edit')}
      />
      <div className={'p-4 bg-2'}>
        <div className={'pb-4 mb-2'}>
          <p className={'text-sm'}>
            {session?.nogi ? 'nogi' : 'gi'} {session?.type ?? ''}
          </p>
          <h1 className={'text-xl'}>
            {dayjs(session?.date).format('dddd MMMM DD YYYY')}{' '}
          </h1>
          {coach?.name ? (
            <p className={'text-sm'}>Coach: {coach.name}</p>
          ) : null}
        </div>
        <div>
          <div className={'mb-4'}>
            <StatLine
              text={convertSecondsToDuration(session?.durationSeconds ?? 0)}
              subText={'Duration'}
              icon={<ClockIcon className={'size-4'} />}
            />
          </div>
          <div className={'grid grid-cols-2 gap-4'}>
            <StatLine
              text={session?.rollCount ?? 0}
              icon={<BarChartIcon className={'size-4'} />}
              subText={'Rolls'}
            />

            {session?.avgHeartRate ? (
              <StatLine
                text={session.avgHeartRate ?? 0}
                icon={<HeartRateIcon className={'size-4'} />}
                subText={'Avg. Heart Rate'}
              />
            ) : null}
            {session?.calories ? (
              <StatLine
                text={session.calories}
                subText={'Calories'}
                icon={<ChartIcon className={'size-4'} />}
              />
            ) : null}
          </div>

          {session?.notes && (
            <div className={'mt-4'}>
              <p className={'mb-1'}>Notes:</p>
              <div className={'p-2 border-4 border-gray-500 border-opacity-25'}>
                <p>{session.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={'pl-2 mt-4 flex items-center justify-between'}>
        <p>Logged rolls: {rolls?.length ?? 0}</p>
        <Modal
          title={'Add Roll'}
          fullScreen
          trigger={
            <button className='flex gap-2 items-center text-base'>
              <PlusIcon /> Add Roll
            </button>
          }
          renderChildren={({ closeModal }) => (
            <AddRollForm
              hideDate
              onSuccess={closeModal}
              initialValues={{
                date: session?.date,
                session: session?.id,
                nogi: !!session?.nogi,
              }}
            />
          )}
        />
      </div>
      <div className={'bg-2 p-4'}>
        {rolls?.length ? (
          <div className={'space-y-2 mb-2'}>
            {rolls.map(({ teammate, id, nogi, subsFor, subsAgainst }) => (
              <div key={id} className={'flex items-center gap-2'}>
                <p className={'text-lg'}>{teammate?.name ?? 'Unknown'}</p>
                <p>({nogi ? 'nogi' : 'gi'})</p>
                <p>
                  {/*  TODO: new ui for this list. Accordion maybe */}
                  {subsFor?.length} & {subsAgainst?.length}
                </p>

                <button
                  className={'flex items-center ml-auto'}
                  onClick={() => {
                    void removeRoll(id);
                  }}
                >
                  <Cross1Icon />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No rolls logged</p>
        )}
      </div>
    </>
  );
};

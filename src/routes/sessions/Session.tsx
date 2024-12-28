import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import dayjs from 'dayjs';
import { PlusIcon, Cross1Icon } from '@radix-ui/react-icons';

import { useRolls } from '../../hooks/useRolls.ts';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { AddRollForm } from '../../components/AddRollForm.tsx';
import { convertSecondsToDuration } from '../../utilities/duration.tsx';
import { SessionForm } from '../../components/SessionForm.tsx';
import { useTeammates } from '../../hooks/useTeammates.ts';
import { Modal } from '../../components/Modal.tsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';

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
  } = useSessions(id ? +id : undefined);
  const { data: teammates } = useTeammates();
  const session = sessions?.[0];
  const [showingRollForm, setShowingRollForm] = useState(false);
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
    // navigate to /sessions
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
      <div className={'p-4'}>
        <button onClick={() => setMode('view')}>Back</button>
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
    <div className={'p-4'}>
      <h1 className={'text-xl my-4'}>
        {dayjs(session?.date).format('dddd MMMM DD YYYY')}{' '}
      </h1>
      <div className={'space-y-4 border-b pb-4 mb-4'}>
        {coach?.name ? <p>Coach: {coach.name}</p> : null}

        {session?.avgHeartRate ? (
          <p>Avg Heart Rate: {session.avgHeartRate}</p>
        ) : null}
        {session?.calories ? <p>Calories Burned: {session.calories}</p> : null}
        {session?.durationSeconds ? (
          <p>Duration: {convertSecondsToDuration(session.durationSeconds)}</p>
        ) : null}

        <div className={'flex gap-4'}>
          <button
            className={'underline'}
            onClick={() => {
              setMode('edit');
            }}
          >
            Edit details
          </button>
          <Modal
            title={'Delete Session'}
            trigger={<button className={'danger'}>Delete Session</button>}
            renderChildren={({ closeModal }) => {
              return (
                <div>
                  <p className={'text-lg mb-4'}>
                    Are you sure you want to delete this session?
                  </p>
                  <div className={'flex gap-4 items-center'}>
                    <button className={'primary'} onClick={closeModal}>
                      No, keep it
                    </button>
                    <button
                      className={'danger'}
                      onClick={() => {
                        void handleDelete(closeModal);
                      }}
                    >
                      Yes, ditch it.
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>

      {rolls?.length ? (
        <div className={'space-y-2 border-b pb-2 mb-2'}>
          <p>Logged Rolls: {rolls.length} </p>
          {rolls.map(({ teammate, id }) => (
            <div key={id} className={'flex items-center justify-between'}>
              <p>{teammate?.name}</p>
              <button
                className={'flex items-center'}
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
      {showingRollForm ? (
        <div>
          <p>Roll details: </p>
          <AddRollForm
            hideDate
            onSuccess={() => {
              setShowingRollForm(false);
            }}
            initialValues={{
              date: session?.date,
              session: session?.id,
            }}
          />
        </div>
      ) : (
        <button
          className='flex gap-2 items-center'
          onClick={() => {
            setShowingRollForm(true);
          }}
        >
          <PlusIcon /> Add roll
        </button>
      )}
    </div>
  );
};

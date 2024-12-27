import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { PlusIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useRolls } from '../../hooks/useRolls.ts';
import { useSessions } from '../../hooks/useSessions/useSessions.ts';
import { useState } from 'react';
import { AddRollForm } from '../../components/AddRollForm.tsx';

export const Session = () => {
  const { id } = useParams();
  const { data: rolls, removeRoll } = useRolls({
    sessionId: id ? +id : undefined,
  });
  const { data: sessions, isLoading } = useSessions(id ? +id : undefined);
  const session = sessions?.[0];
  const [showingRollForm, setShowingRollForm] = useState(false);

  if (isLoading) {
    return (
      <div className={'p-4'}>
        <p>TODO: loading</p>
      </div>
    );
  }

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl my-4'}>
        {dayjs(session?.date).format('dddd MMMM DD YYYY')}{' '}
      </h1>
      <p>Roll Count: {session?.rollCount}</p>
      {rolls?.length ? (
        <div className={'space-y-1 border-b'}>
          <p>Logged Rolls: </p>
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

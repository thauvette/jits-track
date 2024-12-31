import { useCallback, useEffect, useState } from 'react';
import { useSessions } from '../../../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from '../../../components/LoadingSpinner.tsx';
import toast, { CheckmarkIcon } from 'react-hot-toast';
import { Cross1Icon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';
import { RollsForm } from './RollsForm.tsx';
import { ImportedSession } from './types.ts';

export const Row = ({
  item,
  onSuccess,
  onError,
  isActive,
}: {
  item: ImportedSession;
  onSuccess: () => void;
  onError: () => void;
  isActive: boolean;
}) => {
  // if isActive,
  const [status, setStatus] = useState<null | 'pending' | 'success' | 'error'>(
    null,
  );

  const [addRollsModalState, setAddRollsModalState] = useState<{
    isOpen: boolean;
    sessionId: number | null;
  }>({
    isOpen: false,
    sessionId: null,
  });
  const { createSession } = useSessions();
  // pop a modal for rolls?
  // try to match name to teammate,
  // otherwise create

  const start = useCallback(async () => {
    setStatus('pending');
    try {
      const { data, error } = await createSession({
        date: item.date,
        duration_seconds: item.duration ?? undefined,
        coach: item.coach ? +item.coach : undefined,
        avg_heart_rate: item.avg_heart_rate ? +item.avg_heart_rate : undefined,
        calories: item.calories ?? undefined,
        type: item.type ?? '',
      });

      if (error || !data) {
        setStatus('error');
        onError();
        return;
      }
      if (!item.rolls?.length) {
        setStatus('success');
        onSuccess();
        return;
      }

      setAddRollsModalState({
        isOpen: true,
        sessionId: data.id,
      });
    } catch (err) {
      setStatus('error');
      onError();
      let message = 'failed to import session';
      if (err instanceof Error && err.message) {
        message = err.message;
      }
      toast.error(message);
    }
  }, [item, onError, onSuccess, createSession]);

  useEffect(() => {
    if (isActive && !status) {
      void start();
    }
  }, [isActive, status, start]);
  // try import,
  return (
    <>
      <p className={'col-start-1'}>{item.date}</p>
      <p>{item.type}</p>
      <p>{item.coach}</p>
      <p>{item.rolls?.length ?? 0}</p>
      <p>{item.isNogi ? 'yes' : 'no'}</p>
      <div>
        {status === 'pending' ? (
          <LoadingSpinner />
        ) : status === 'success' ? (
          <CheckmarkIcon />
        ) : status === 'error' ? (
          <Cross1Icon />
        ) : null}
      </div>

      <Dialog.Root open={addRollsModalState.isOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='DialogOverlay' />
          <Dialog.Content className='fixed inset-0 z-20 p-4 bg-white overflow-y-auto'>
            <Dialog.Title title={'Add Rolls'} />
            <Dialog.Description className={'text-xl font-bold'}>
              Add Rolls for {item.date}
            </Dialog.Description>
            <p className={'mb-2'}>
              Match the imported roll names with a teammate.
            </p>
            {addRollsModalState.sessionId && (
              <RollsForm
                names={item.rolls ?? []}
                onSuccess={() => {
                  setAddRollsModalState((current) => ({
                    ...current,
                    isOpen: false,
                  }));
                  setStatus('success');
                  onSuccess();
                }}
                onError={() => {
                  setAddRollsModalState((current) => ({
                    ...current,
                    isOpen: false,
                  }));
                  onError();
                }}
                session={addRollsModalState.sessionId}
                date={item.date}
                isNogiSession={item.isNogi}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

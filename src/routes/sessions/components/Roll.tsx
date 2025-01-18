import { Roll as IRoll } from '../../../hooks/useRolls/types.ts';
import { Cross1Icon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';
import { HydratedSession } from '../../../hooks/useSessions/types.ts';
import { useRolls } from '../../../hooks/useRolls/useRolls.ts';
import { Modal } from '../../../components/Modal.tsx';
import { AddRollForm } from '../../../components/AddRollForm.tsx';
import { useProfile } from '../../../hooks/useProfile.ts';

export const SessionRolls = ({ session }: { session: HydratedSession }) => {
  const { data: rolls, removeRoll } = useRolls({ sessionId: session.id });
  const { data: profile } = useProfile();
  return (
    <>
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
                duration: profile?.default_round_length,
              }}
            />
          )}
        />
      </div>
      <div>
        {rolls?.length ? (
          <div className={'space-y-2 mb-2 px-2'}>
            {rolls.map((roll) => (
              <Roll roll={roll} removeRoll={removeRoll} key={roll.id} />
            ))}
          </div>
        ) : (
          <p>No rolls logged</p>
        )}
      </div>
    </>
  );
};

export const Roll = ({
  roll,
  removeRoll,
}: {
  roll: IRoll;
  removeRoll: (id: number) => void;
}) => {
  const { teammate, id, nogi, subsFor, subsAgainst } = roll;
  return (
    <div key={id} className={'flex items-center gap-2 card p-4'}>
      <p className={'text-lg'}>{teammate?.name ?? 'Unknown'}</p>
      <p>({nogi ? 'nogi' : 'gi'})</p>
      <p>
        {/*  TODO: new ui for this list. Accordion maybe */}
        {subsFor?.length} & {subsAgainst?.length}
      </p>
      <div className={'ml-auto flex items-center gap-2'}>
        <Modal
          title={'Edit Roll'}
          fullScreen
          trigger={
            <button className='flex gap-2 items-center text-base'>
              <Pencil2Icon />
            </button>
          }
          renderChildren={({ closeModal }) => (
            <AddRollForm
              hideDate
              onSuccess={closeModal}
              initialValues={{
                date: roll.date,
                session: roll.session,
                nogi: roll.nogi,
                teammate: roll.teammate?.id,
                subsFor: roll.subsFor?.map(({ sub }) => sub) ?? [],
                subsAgainst: roll.subsAgainst?.map(({ sub }) => sub) ?? [],
                duration: roll.durationInSeconds,
              }}
              roll={roll}
            />
          )}
        />
        <button
          className={'flex items-center '}
          onClick={() => {
            void removeRoll(id);
          }}
        >
          <Cross1Icon />
        </button>
      </div>
    </div>
  );
};

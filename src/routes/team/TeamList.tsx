import { Cross1Icon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useTeammates } from '../../hooks/useTeammates.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { useState } from 'react';
import { AddTeammateForm } from '../../components/AddTeammateForm.tsx';
import { Link } from 'react-router';
import { Modal } from '../../components/Modal.tsx';

export const TeamList = () => {
  const { data: team, isLoading } = useTeammates();
  const [showAdd, setShowAdd] = useState<boolean>(false);

  return (
    <div className={'p-4'}>
      <h1 className={'text-lg font-bold'}>My Team</h1>
      {isLoading && (
        <div className='pt-2 flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div className={'divide-y-2'}>
        {team?.map((mate) => (
          <div key={mate.id} className={'flex gap-2 py-3 items-center'}>
            <Link to={`${mate.id}`} className={'underline'}>
              {mate.name}: {mate.beltName} belt
            </Link>
            <Modal
              title={`Edit teammate}`}
              trigger={
                <button
                  className={'ml-auto'}
                  onClick={() => {}}
                  aria-label={`edit ${mate.name}`}
                >
                  <Pencil2Icon />
                </button>
              }
              renderChildren={({ closeModal }) => {
                return (
                  <AddTeammateForm
                    initialValues={{
                      ...mate,
                    }}
                    onSuccess={closeModal}
                  />
                );
              }}
            />
          </div>
        ))}
      </div>
      <div className={'mt-4'}>
        {showAdd ? (
          <div>
            <div className={'flex gap-2 justify-between items-center'}>
              <p className={'text-lg'}>New Teammate</p>
              <button
                onClick={() => {
                  setShowAdd(false);
                }}
                className={'flex gap-2 items-center'}
              >
                <Cross1Icon /> Cancel
              </button>
            </div>

            <AddTeammateForm
              onSuccess={() => {
                setShowAdd(false);
              }}
            />
          </div>
        ) : (
          <button
            className={'primary flex items-center gap-2'}
            onClick={() => setShowAdd(true)}
          >
            <PlusIcon /> Add Teammate
          </button>
        )}
      </div>
    </div>
  );
};

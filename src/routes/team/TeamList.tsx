import {
  Cross1Icon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { Link } from 'react-router';
import { useTeammates } from '../../hooks/useTeammates.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { useState } from 'react';
import { AddTeammateForm } from '../../components/AddTeammateForm.tsx';
import { Modal } from '../../components/Modal.tsx';

export const TeamList = () => {
  const { data: team, isLoading } = useTeammates();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeam = searchTerm
    ? team?.filter((member) => {
        return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : team;

  const sortedTeam = filteredTeam
    ? structuredClone(filteredTeam).sort((a, b) => {
        return a.belt > b.belt ? -1 : 1;
      })
    : team;

  return (
    <div className={'p-4'}>
      <h1 className={'text-lg font-bold mb-2'}>My Team</h1>
      {isLoading && (
        <div className='pt-2 flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}
      <div className={'relative mb-4'}>
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
          placeholder={'Search...'}
        />
        <MagnifyingGlassIcon
          className={'absolute right-2 top-1/2 transform -translate-y-1/2'}
        />
      </div>
      <div className={'divide-y-2'}>
        {sortedTeam?.map((mate) => (
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

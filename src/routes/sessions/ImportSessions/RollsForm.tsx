import { useTeammates } from '../../../hooks/useTeammates.ts';
import { useRolls } from '../../../hooks/useRolls.ts';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { AddTeammateForm } from '../../../components/AddTeammateForm.tsx';

export const RollsForm = ({
  names,
  date,
  session,
  isNogiSession,
  onSuccess,
  onError,
}: {
  names: string[];
  date: string;
  session: number;
  isNogiSession: boolean;
  onSuccess: () => void;
  onError: () => void;
}) => {
  const { data: teammates } = useTeammates();
  const { addRoll } = useRolls();

  const [showCreateAtIndex, setShowCreateAtIndex] = useState<number | null>(
    null,
  );
  const [rolls, setRolls] = useState(
    names.map((name) => {
      const match = teammates?.find((teammate) => teammate.name === name);
      return {
        id: match?.id ?? null,
        name,
        nogi: isNogiSession,
      };
    }),
  );
  const submit = async () => {
    const { data, error } = await addRoll(
      rolls.reduce<
        {
          teammateId: number;
          date: string;
          session: number;
          nogi: boolean;
        }[]
      >((arr, roll) => {
        if (roll.id) {
          arr.push({
            teammateId: roll.id,
            date,
            session,
            nogi: roll.nogi,
          });
        }
        return arr;
      }, []),
    );
    if (error) {
      onError();
      return toast.error('Error importing rolls');
    }
    if (data) {
      onSuccess();
    }
  };

  const teamOptions = teammates?.map((teammate) => ({
    value: teammate.id,
    label: teammate.name,
  }));
  return (
    <div>
      {rolls.map((roll, index) => (
        <div key={index} className={'mb-2  py-2'}>
          <p>{roll.name}</p>
          <CreatableSelect
            className={`custom-select ${showCreateAtIndex === index ? 'hidden' : ''}`}
            classNamePrefix={'custom-select'}
            options={teamOptions}
            value={teamOptions?.find(
              ({ value }) => roll.id && value === +roll?.id,
            )}
            isOptionSelected={(option) => roll.id === option.value}
            onChange={(value) => {
              setRolls(
                rolls.map((roll, rollIndex) =>
                  rollIndex === index
                    ? {
                        ...roll,
                        id: value?.value ?? null,
                      }
                    : roll,
                ),
              );
            }}
            onCreateOption={() => {
              setShowCreateAtIndex(index);
            }}
          />
          {showCreateAtIndex === index && (
            <div className='border-2 p-2'>
              <AddTeammateForm
                initialValues={{
                  name: roll.name,
                }}
                onSuccess={(result) => {
                  setRolls(
                    rolls.map((roll, rollIndex) =>
                      rollIndex === index
                        ? {
                            ...roll,
                            id: result.id,
                          }
                        : roll,
                    ),
                  );
                  setShowCreateAtIndex(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
      <div className='pt-4'>
        <button
          className={'primary disabled:opacity-50'}
          disabled={rolls?.some(({ id }) => !id)}
          onClick={submit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

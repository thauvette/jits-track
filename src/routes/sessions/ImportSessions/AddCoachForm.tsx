import { useTeammates } from '../../../hooks/useTeammates.ts';
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { AddTeammateForm } from '../../../components/AddTeammateForm.tsx';

interface CoachItem {
  name: string;
  id?: number;
  items: number[];
  coachId?: number | null;
}

export const AddCoachForm = ({
  coaches,
  handleSubmit,
}: {
  coaches: CoachItem[];
  handleSubmit: (coaches: CoachItem[]) => void;
}) => {
  const { data: teammates } = useTeammates();
  const [showCreateAtIndex, setShowCreateAtIndex] = useState<number | null>(
    null,
  );
  const [results, setResults] = useState(
    coaches.map((coach) => {
      const match = teammates?.find((teammate) => {
        return teammate.name?.toLowerCase() === coach.name.toLowerCase();
      });
      return {
        ...coach,
        coachId: match?.id ?? null,
      };
    }),
  );
  console.log(results);

  const options =
    teammates?.map((teammate) => ({
      value: teammate.id,
      label: teammate.name,
    })) ?? [];

  return (
    <div>
      {results.map((coach, index) => {
        return (
          <div key={index} className={'mb-4'}>
            <p>{coach.name}</p>
            <CreatableSelect
              options={options}
              value={options?.find((option) => option.value === coach.coachId)}
              className={`${showCreateAtIndex === index ? 'hidden' : ''}`}
              isOptionSelected={(option) => coach.coachId === option.value}
              onChange={(option) => {
                const current = structuredClone(results);
                current[index] = {
                  ...current[index],
                  coachId: option?.value ?? null,
                };
                setResults(current);
              }}
              onCreateOption={() => {
                setShowCreateAtIndex(index);
              }}
            />
            {showCreateAtIndex === index && (
              <div className='border-2 p-2'>
                <button onClick={() => setShowCreateAtIndex(null)}>
                  Cancel
                </button>
                <AddTeammateForm
                  initialValues={{
                    name: coach.name,
                  }}
                  onSuccess={(result) => {
                    const current = structuredClone(results);
                    current[index] = {
                      ...current[index],
                      coachId: result?.id,
                    };
                    setResults(current);
                    setShowCreateAtIndex(null);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <div className={'my-4'}>
        <button
          disabled={results.some(({ coachId }) => !coachId)}
          onClick={() => {
            handleSubmit(results);
          }}
          className={'primary disabled:opacity-50'}
        >
          Save Coaches
        </button>
      </div>
    </div>
  );
};

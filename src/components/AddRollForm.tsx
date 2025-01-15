import { Field, Formik } from 'formik';
import CreatableSelect from 'react-select/creatable';

import { Roll, useRolls } from '../hooks/useRolls.ts';
import { useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useCallback, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner.tsx';
import { Cross1Icon } from '@radix-ui/react-icons';

export const AddRollForm = ({
  initialValues,
  onSuccess,
  hideDate = false,
}: {
  initialValues?: {
    session?: number;
    teammate?: number;
    date?: string;
    nogi?: boolean;
  };
  onSuccess: (roll: Roll) => void;
  hideDate?: boolean;
}) => {
  const { data: teammates } = useTeammates();
  const { addRoll } = useRolls({
    sessionId: initialValues?.session,
  });
  const [newTeamMemberDialog, setNewTeamMemberDialog] = useState<{
    isOpen: boolean;
    name: string;
    belt: number | null;
    isCoach: boolean;
  }>({
    isOpen: false,
    name: '',
    belt: null,
    isCoach: false,
  });
  const teamOptions =
    teammates?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) || [];

  const dismissNewTeamMemberDialog = useCallback(() => {
    setNewTeamMemberDialog({
      isOpen: false,
      name: '',
      belt: null,
      isCoach: false,
    });
  }, []);

  return (
    <Formik
      initialValues={{
        session: initialValues?.session ?? '',
        teammate: initialValues?.teammate ?? '',
        date: initialValues?.date ?? '',
        nogi: initialValues?.nogi ?? false,
      }}
      onSubmit={async (values) => {
        const { data } = await addRoll({
          teammateId: values.teammate ? +values.teammate : null,
          date: values.date,
          session: values.session ? +values.session : undefined,
          nogi: !!values.nogi,
        });
        if (data && onSuccess) {
          onSuccess(data[0]);
        }
      }}
    >
      {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
        return newTeamMemberDialog.isOpen ? (
          <>
            <div className={'flex gap-2 items-center'}>
              <p className={'text-xl font-bold'}>Add team member</p>
              <button
                onClick={dismissNewTeamMemberDialog}
                aria-label={'Cancel add team member'}
                className={'ml-auto'}
              >
                <Cross1Icon />
              </button>
            </div>
            <AddTeammateForm
              initialValues={{
                name: newTeamMemberDialog.name,
                belt: newTeamMemberDialog.belt ?? 1,
                isCoach: newTeamMemberDialog.isCoach,
              }}
              onSuccess={async (result) => {
                await setFieldValue('teammate', result.id);
                dismissNewTeamMemberDialog();
              }}
            />
          </>
        ) : (
          <form onSubmit={handleSubmit} className={'space-y-4'}>
            <>
              {hideDate && initialValues?.date ? null : (
                <div>
                  <label>
                    <p>Date</p>
                    <Field type={'date'} name={'date'} />
                  </label>
                </div>
              )}
              <div>
                <label>
                  <p>Teammate</p>

                  <CreatableSelect
                    className={'custom-select'}
                    classNamePrefix={'custom-select'}
                    options={teamOptions}
                    name={'teammate'}
                    isSearchable
                    isClearable
                    value={teamOptions?.find(
                      ({ value }) => value === +values.teammate,
                    )}
                    onChange={async (option) => {
                      await setFieldValue('teammate', option?.value ?? '');
                    }}
                    onCreateOption={(option) => {
                      setNewTeamMemberDialog({
                        isOpen: true,
                        name: option,
                        belt: 1,
                        isCoach: false,
                      });
                    }}
                  />
                </label>
              </div>
              <div>
                <label className={'flex gap-2 items-center'}>
                  <Field name={'nogi'} type={'checkbox'} />
                  <p>Nogi</p>
                </label>
              </div>
              <div>
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : (
                  <button
                    disabled={isSubmitting}
                    type={'submit'}
                    className={'primary disabled:opacity-50'}
                  >
                    Add Roll
                  </button>
                )}
              </div>
            </>
          </form>
        );
      }}
    </Formik>
  );
};

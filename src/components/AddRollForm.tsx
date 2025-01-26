import { Field, Formik } from 'formik';
import CreatableSelect from 'react-select/creatable';

import { useRolls } from '../hooks/useRolls/useRolls.ts';
import { Roll } from '../hooks/useRolls/types.ts';
import { useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useCallback, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner.tsx';
import { Cross1Icon } from '@radix-ui/react-icons';
import { SubSelect } from './SubSelect.tsx';
import { DurationFields } from './DurationFields.tsx';

export const AddRollForm = ({
  initialValues,
  onSuccess,
  hideDate = false,
  roll = null,
}: {
  initialValues?: {
    session?: number;
    teammate?: number;
    date?: string;
    nogi?: boolean;
    subsFor?: number[];
    subsAgainst?: number[];
    duration?: number | null;
  };
  onSuccess: (roll: Roll) => void;
  hideDate?: boolean;
  roll?: Roll | null;
}) => {
  const { data: teammates } = useTeammates();
  const { addRoll, updateRoll } = useRolls({
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
        subsFor: initialValues?.subsFor || [],
        subsAgainst: initialValues?.subsAgainst || [],
        duration: initialValues?.duration ? initialValues.duration : 360,
      }}
      onSubmit={async (values) => {
        const req = {
          teammateId: values.teammate ? +values.teammate : null,
          date: values.date,
          session: values.session ? +values.session : undefined,
          nogi: !!values.nogi,
          subsFor: values.subsFor,
          subsAgainst: values.subsAgainst,
          duration: values.duration,
        };

        const { data } = roll?.id
          ? await updateRoll(roll, req)
          : await addRoll(req);
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
          <form onSubmit={handleSubmit} className={'space-y-6'}>
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
            <div className={'flex'}>
              <div>
                <label className={'flex gap-2 items-center'}>
                  <Field name={'nogi'} type={'checkbox'} />
                  <p>Nogi</p>
                </label>
              </div>
            </div>
            <div>
              <label>
                <p>Subs for</p>
                <SubSelect
                  onChange={(values) => {
                    void setFieldValue('subsFor', values);
                  }}
                  values={values.subsFor || []}
                />
              </label>
            </div>
            <div className={''}>
              <label>
                <p>Subs against</p>
                <SubSelect
                  onChange={(values) => {
                    void setFieldValue('subsAgainst', values);
                  }}
                  values={values.subsAgainst || []}
                />
              </label>
            </div>
            <DurationFields
              hiddenFields={['hours']}
              onChange={(value) => {
                void setFieldValue('duration', value);
              }}
              valueInSeconds={values.duration}
            />

            <div>
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <button
                  disabled={isSubmitting}
                  type={'submit'}
                  className={'primary disabled:opacity-50 w-full'}
                >
                  Add Roll
                </button>
              )}
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

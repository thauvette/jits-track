import { Field, Formik } from 'formik';
import CreatableSelect from 'react-select/creatable';
import * as Dialog from '@radix-ui/react-dialog';

import { Roll, useRolls } from '../hooks/useRolls.ts';
import { useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useState } from 'react';

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
          teammateId: +values.teammate,
          date: values.date,
          session: values.session ? +values.session : undefined,
          nogi: !!values.nogi,
        });
        if (data && onSuccess) {
          onSuccess(data[0]);
        }
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit} className={'space-y-4'}>
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
                      belt: 5,
                      isCoach: true,
                    });
                  }}
                />
              </label>
              <Dialog.Root
                open={newTeamMemberDialog.isOpen}
                onOpenChange={(isOpen) => {
                  setNewTeamMemberDialog({
                    isOpen,
                    name: '',
                    isCoach: false,
                    belt: null,
                  });
                }}
              >
                <Dialog.Portal>
                  <Dialog.Overlay className='DialogOverlay' />
                  <Dialog.Content className='DialogContent'>
                    <Dialog.Title title={'Add Coach'} />
                    <Dialog.Description>Add Coach</Dialog.Description>
                    <AddTeammateForm
                      initialValues={{
                        name: newTeamMemberDialog.name,
                        belt: newTeamMemberDialog.belt ?? 1,
                        isCoach: newTeamMemberDialog.isCoach,
                      }}
                      onSuccess={async (result) => {
                        await setFieldValue('teammate', result.id);
                        setNewTeamMemberDialog({
                          isOpen: false,
                          name: '',
                          belt: null,
                          isCoach: false,
                        });
                      }}
                    />
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
            <div>
              <label className={'flex gap-2 items-center'}>
                <Field name={'nogi'} type={'checkbox'} />
                <p>Nogi</p>
              </label>
            </div>
            <div>
              <button type={'submit'} className={'primary'}>
                Add Roll
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

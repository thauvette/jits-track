import { useState } from 'react';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import CreatableSelect from 'react-select/creatable';
import * as Dialog from '@radix-ui/react-dialog';

import { Belt, useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useSessions } from '../hooks/useSessions/useSessions.ts';

const schema = yup.object({
  date: yup.string().required(),
  duration: yup.string().required(),
  coach: yup.number(),
  roll_count: yup.number(),
  avg_heart_rate: yup.number(),
  calories: yup.number(),
  type: yup.string(),
});

// TODO: rolls get added separately with the resulting id from the new session.
export const SessionForm = ({
  onSuccess,
}: {
  onSuccess: ({ id }: { id: number }) => void;
}) => {
  const [newTeamMemberDialog, setNewTeamMemberDialog] = useState<{
    isOpen: boolean;
    name: string;
    belt: Belt | null;
    isCoach: boolean;
  }>({
    isOpen: false,
    name: '',
    belt: null,
    isCoach: false,
  });

  const { createSession } = useSessions();
  const { data: team } = useTeammates();

  const coaches =
    team
      ?.filter(({ isCoach }) => isCoach)
      ?.map((coach) => ({
        value: coach.id,
        label: coach.name,
      })) ?? [];

  return (
    <>
      <Formik
        initialValues={{
          date: dayjs().format('YYYY-MM-DD'),
          duration: '01:00:00',
          coach: '',
          roll_count: '',
          avg_heart_rate: '',
          calories: '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const [hours = 0, minutes = 0, seconds = 0] =
            values?.duration?.split(':') || [];

          const { data } = await createSession({
            date: values.date,
            coach: values.coach ? +values.coach : undefined,
            roll_count: values.roll_count ? +values.roll_count : undefined,
            avg_heart_rate: values.avg_heart_rate
              ? +values.avg_heart_rate
              : undefined,
            duration_seconds: +hours * 60 * 60 + +minutes * 60 + +seconds,
            calories: values.calories ? +values.calories : undefined,
          });
          if (!!onSuccess && data) {
            onSuccess(data);
          }
          return data;
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <label>
                <p>Date</p>
                <Field name={'date'} type={'date'} />
              </label>
              <label>
                <p>Duration</p>
                <Field type={'time'} name={'duration'} step='1' />
              </label>
              <label>
                <p>Coach</p>
                <CreatableSelect
                  options={coaches}
                  name={'coach'}
                  isSearchable
                  isClearable
                  value={coaches?.find(({ value }) => value === +values.coach)}
                  onCreateOption={(option) => {
                    setNewTeamMemberDialog({
                      isOpen: true,
                      name: option,
                      belt: 5,
                      isCoach: true,
                    });
                  }}
                  onChange={async (option) => {
                    await setFieldValue('coach', option?.value ?? '');
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
                        await setFieldValue('coach', result.id);
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
              <label>
                <p>Roll Count</p>
                <Field type={'number'} name={'roll_count'} />
              </label>
              <label>
                <p>Avg Heart Rate</p>
                <Field type={'number'} name={'avg_heart_rate'} />
              </label>
              <label>
                <p>Calories</p>
                <Field type={'number'} name={'calories'} />
              </label>
              <div className={'my-4'}>
                <button className={'primary w-full'} type={'submit'}>
                  Save
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};

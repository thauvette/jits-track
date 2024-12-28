import { useState } from 'react';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import CreatableSelect from 'react-select/creatable';
import * as Dialog from '@radix-ui/react-dialog';

import { Belt, useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useSessions } from '../hooks/useSessions/useSessions.ts';
import { convertDurationToSeconds } from '../utilities/duration.tsx';

const schema = yup.object({
  date: yup.string().required(),
  duration: yup.string().required(),
  coach: yup.number(),
  avg_heart_rate: yup.number(),
  calories: yup.number(),
  type: yup.string(),
});

export const SessionForm = ({
  onSuccess,
  initialValues,
  id,
}: {
  onSuccess: ({ id }: { id: number }) => void;
  initialValues?: {
    date?: string;
    duration?: string;
    coach?: number;
    avg_heart_rate?: number;
    calories?: number;
    type?: string;
  };
  id?: number;
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

  const { createSession, updateSession } = useSessions();
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
          date: initialValues?.date ?? dayjs().format('YYYY-MM-DD'),
          duration: initialValues?.duration ?? '01:00:00',
          coach: initialValues?.coach ?? '',
          avg_heart_rate: initialValues?.avg_heart_rate ?? '',
          calories: initialValues?.calories ?? '',
          type: initialValues?.type ?? '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const req = {
            date: values.date,
            coach: values.coach ? +values.coach : undefined,
            avg_heart_rate: values.avg_heart_rate
              ? +values.avg_heart_rate
              : undefined,
            duration_seconds: convertDurationToSeconds(values.duration),
            calories: values.calories ? +values.calories : undefined,
            type: values.type ?? '',
          };

          const { data } = id
            ? await updateSession(id, req)
            : await createSession(req);
          if (!!onSuccess && data) {
            onSuccess(data);
          }
          return data;
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          return (
            <form onSubmit={handleSubmit} className={'space-y-4'}>
              <div>
                <label>
                  <p>Date</p>
                  <Field name={'date'} type={'date'} />
                </label>
              </div>
              <div>
                <label>
                  <p>Type (eg: Class, Open Mat)</p>
                  <Field name={'type'} />
                </label>
              </div>
              <div>
                <label>
                  <p>Duration</p>
                  <Field type={'time'} name={'duration'} step='1' />
                </label>
              </div>
              <div>
                <label>
                  <p>Coach</p>
                  <CreatableSelect
                    options={coaches}
                    name={'coach'}
                    isSearchable
                    isClearable
                    value={coaches?.find(
                      ({ value }) => value === +values.coach,
                    )}
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
              </div>
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
              <div>
                <label>
                  <p>Avg Heart Rate</p>
                  <Field type={'number'} name={'avg_heart_rate'} />
                </label>
              </div>
              <div>
                <label>
                  <p>Calories</p>
                  <Field type={'number'} name={'calories'} />
                </label>
              </div>
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

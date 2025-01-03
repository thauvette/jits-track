import { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import CreatableSelect from 'react-select/creatable';
import * as Dialog from '@radix-ui/react-dialog';

import { useTeammates } from '../hooks/useTeammates.ts';
import { AddTeammateForm } from './AddTeammateForm.tsx';
import { useSessions } from '../hooks/useSessions/useSessions.ts';
import { LoadingSpinner } from './LoadingSpinner.tsx';

const schema = yup.object({
  date: yup.string().required(),
  coach: yup.number(),
  avg_heart_rate: yup.number(),
  calories: yup.number(),
  type: yup.string(),
  rollCount: yup.number(),
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
    rollCount?: number;
    nogi: boolean;
    notes: string;
  };
  id?: number;
}) => {
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

  const { createSession, updateSession } = useSessions();
  const { data: team } = useTeammates();

  const coaches =
    team
      ?.filter(({ isCoach }) => isCoach)
      ?.map((coach) => ({
        value: coach.id,
        label: coach.name,
      })) ?? [];

  const initialDuration = initialValues?.duration ?? '00:00:00';
  const durationSplit = initialDuration.split(':');

  return (
    <div className={'max-w-4xl mx-auto py-8'}>
      <h1 className={'text-xl font-bold mb-6'}>New Session</h1>
      <Formik
        initialValues={{
          date: initialValues?.date ?? dayjs().format('YYYY-MM-DD'),
          hours: +durationSplit[0],
          minutes: +durationSplit[1],
          seconds: +durationSplit[2],
          coach: initialValues?.coach ?? '',
          avg_heart_rate: initialValues?.avg_heart_rate ?? '',
          calories: initialValues?.calories ?? '',
          type: initialValues?.type ?? '',
          roll_count: initialValues?.rollCount ?? '',
          notes: initialValues?.notes ?? '',
          nogi: !!initialValues?.nogi,
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const duration =
            values.hours * 60 * 60 + values.minutes * 60 + values.seconds;

          const req = {
            date: values.date,
            coach: values.coach ? +values.coach : undefined,
            avg_heart_rate: values.avg_heart_rate
              ? +values.avg_heart_rate
              : undefined,
            duration_seconds: duration,
            calories: values.calories ? +values.calories : undefined,
            type: values.type ?? '',
            roll_count: values.roll_count ? +values.roll_count : 0,
            nogi: !!values.nogi,
            notes: values.notes ?? null,
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
        {({ handleSubmit, setFieldValue, values, isSubmitting }) => {
          return (
            <form onSubmit={handleSubmit} className={'space-y-4'}>
              <div>
                <label>
                  <p>Date</p>
                  <Field name={'date'} type={'date'} />
                </label>
                <ErrorMessage
                  name={'date'}
                  component={'p'}
                  className={'text-red-600'}
                />
              </div>
              <div>
                <label>
                  <p>Type (eg: Class, Open Mat)</p>
                  <Field name={'type'} />
                </label>
              </div>
              <div>
                <label className={'flex gap-2 items-center'}>
                  <Field name={'nogi'} type={'checkbox'} />
                  <p>Nogi</p>
                </label>
              </div>
              <div>
                <p>Duration</p>
                <div className={'flex gap-2'}>
                  <label>
                    <p>Hours:</p>
                    <Field
                      name={'hours'}
                      type={'number'}
                      max={12}
                      min={0}
                      step={1}
                      onClick={(event: Event) => {
                        if (event.target instanceof HTMLInputElement) {
                          event.target.select();
                        }
                      }}
                    />
                  </label>
                  <label>
                    <p>Minutes:</p>
                    <Field
                      name={'minutes'}
                      type={'number'}
                      max={59}
                      min={0}
                      step={1}
                      onClick={(event: Event) => {
                        if (event.target instanceof HTMLInputElement) {
                          event.target.select();
                        }
                      }}
                    />
                  </label>
                  <label>
                    <p>Seconds:</p>
                    <Field
                      name={'seconds'}
                      type={'number'}
                      max={59}
                      min={0}
                      step={1}
                      onClick={(event: Event) => {
                        if (event.target instanceof HTMLInputElement) {
                          event.target.select();
                        }
                      }}
                    />
                  </label>
                </div>
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
                <label>Roll Count</label>
                <Field type={'number'} name={'roll_count'} />
              </div>
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
              <div>
                <label>
                  <p>Notes</p>
                  <Field name={'notes'} as={'textarea'} />
                </label>
              </div>
              <div className={'my-4'}>
                {isSubmitting ? (
                  <div className={'flex justify-center'}>
                    <LoadingSpinner />
                  </div>
                ) : (
                  <button
                    disabled={isSubmitting}
                    className={'primary w-full disabled:opacity-50'}
                    type={'submit'}
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

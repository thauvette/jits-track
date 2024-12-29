import { Field, Formik } from 'formik';
import * as yup from 'yup';

import { Teammate, useTeammates } from '../hooks/useTeammates.ts';
import { belts } from '../config/betls.ts';

export const AddTeammateForm = ({
  initialValues,
  onSuccess,
}: {
  initialValues?: {
    name?: string;
    belt?: number;
    isCoach?: boolean;
    id?: number;
  };
  onSuccess?: (result: Teammate) => void;
}) => {
  const { addTeammate, updateTeammate } = useTeammates();
  const schema = yup.object({
    name: yup.string().required(),
    belt: yup.number().min(1).max(5),
    isCoach: yup.boolean(),
  });
  return (
    <Formik
      initialValues={{
        name: initialValues?.name ?? '',
        belt: initialValues?.belt ?? 1,
        isCoach: !!initialValues?.isCoach,
        id: initialValues?.id ?? null,
      }}
      validationSchema={schema}
      onSubmit={async (values) => {
        const result = values.id
          ? await updateTeammate(values)
          : await addTeammate(values);
        if (onSuccess && result) {
          onSuccess(result);
        }
        return result;
      }}
    >
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={'my-4'}>
              <label>
                <p>Name:</p>
                <Field name={'name'} />
              </label>
            </div>
            <div className={'my-4'}>
              <label>
                <p>Belt:</p>
                <Field name={'belt'} as='select'>
                  {belts.map((belt, index) => (
                    <option key={index} value={index + 1}>
                      {belt}
                    </option>
                  ))}
                </Field>
              </label>
            </div>
            <div className={'my-4'}>
              <label className='flex gap-2 items-center'>
                <Field name={'isCoach'} type={'checkbox'} />
                <p>Is Coach</p>
              </label>
            </div>
            <button type={'submit'} className={'primary w-full'}>
              Save
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

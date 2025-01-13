import { Field, Formik } from 'formik';
import {
  convertDurationToSeconds,
  convertSecondsToDuration,
} from '../utilities/duration.tsx';
import { belts } from '../config/betls.ts';
import { useProfile } from '../hooks/useProfile.ts';

export const ProfileForm = ({
  initialValues,
}: {
  initialValues?: {
    display_name?: string;
    default_round_length?: number;
    belt?: number;
  };
}) => {
  const { updateProfile } = useProfile();
  const initialDuration = initialValues?.default_round_length
    ? convertSecondsToDuration(initialValues.default_round_length)
    : convertSecondsToDuration(360);
  const durationSplit = initialDuration.split(':');

  return (
    <Formik
      initialValues={{
        display_name: initialValues?.display_name ?? '',
        default_round_length: initialValues?.default_round_length ?? 360,
        belt: initialValues?.belt ?? 1,
        minutes: +durationSplit[1],
        seconds: +durationSplit[2],
      }}
      onSubmit={async (values) => {
        await updateProfile({
          display_name: values.display_name ?? '',
          default_round_length: convertDurationToSeconds(
            `00:${values.minutes}:${values.seconds}:${values.seconds}`,
          ),
          belt: +values.belt,
        });
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <form onSubmit={handleSubmit} className={''}>
            <div className={'my-4'}>
              <p>Display Name</p>
              <Field name={'display_name'} />
            </div>
            <div className={'my-4'}>
              <p>Current Belt</p>
              <Field name={'belt'} as={'select'}>
                {belts.map((belt, index) => (
                  <option key={belt} value={index + 1}>
                    {belt}
                  </option>
                ))}
              </Field>
            </div>
            <div className={'my-4'}>
              <p>Default Roll Length</p>
              <div className={'flex gap-2'}>
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
            <button
              disabled={isSubmitting}
              className={`primary ${isSubmitting ? 'animate-pulse' : ''}`}
              type={'submit'}
            >
              Save
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

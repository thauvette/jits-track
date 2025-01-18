import {
  convertDurationToSeconds,
  convertSecondsToDuration,
} from '../utilities/duration.tsx';

const fields = ['hours', 'minutes', 'seconds'];

export const DurationFields = ({
  onChange,
  hiddenFields = null,
  valueInSeconds,
}: {
  onChange: (value: number) => void;
  hiddenFields?: string[] | null;
  valueInSeconds: number;
}) => {
  const values = convertSecondsToDuration(valueInSeconds).split(':');
  const handleChange = (
    name: 'hours' | 'minutes' | 'seconds',
    value: string,
  ) => {
    const index = fields.indexOf(name);
    const current = [...values];
    current[index] = value;
    onChange(convertDurationToSeconds(current.join(':')));
  };

  return (
    <div className={'flex gap-2'}>
      {!hiddenFields?.includes('hours') && (
        <label>
          <p>Hours:</p>
          <input
            name={'hours'}
            type={'number'}
            max={12}
            min={0}
            step={1}
            value={values[0]}
            onFocus={(event) => {
              if (event.target instanceof HTMLInputElement) {
                event.target.select();
              }
            }}
            onChange={(event) => {
              handleChange('hours', event.target.value);
            }}
          />
        </label>
      )}
      <label>
        <p>Minutes:</p>
        <input
          name={'minutes'}
          type={'number'}
          max={59}
          min={0}
          step={1}
          value={values[1]}
          onFocus={(event) => {
            if (event.target instanceof HTMLInputElement) {
              event.target.select();
            }
          }}
          onChange={(event) => {
            handleChange('minutes', event.target.value);
          }}
        />
      </label>
      <label>
        <p>Seconds:</p>
        <input
          name={'seconds'}
          type={'number'}
          max={59}
          min={0}
          step={1}
          value={values[2]}
          onFocus={(event) => {
            if (event.target instanceof HTMLInputElement) {
              event.target.select();
            }
          }}
          onChange={(event) => {
            handleChange('seconds', event.target.value);
          }}
        />
      </label>
    </div>
  );
};

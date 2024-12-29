import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';

export const DateRangeSelection = ({
  initialDates,
  submit,
  onCancel,
}: {
  initialDates: {
    start: Dayjs;
    end: Dayjs;
  };
  submit: (args: { start: Dayjs; end: Dayjs }) => void;
  onCancel?: () => void;
}) => {
  const [dates, setDates] = useState(initialDates);
  const handleSubmit = () => {
    submit(dates);
  };

  return (
    <div>
      <div className={'flex flex-col md:flex-row items-center gap-4'}>
        <input
          type='date'
          value={dates.start.format('YYYY-MM-DD')}
          onChange={(event) => {
            setDates({
              start: dayjs(event.target.value),
              end: dayjs(event.target.value).isAfter(dates.end)
                ? dayjs(event.target.value)
                : dates.end,
            });
          }}
        />

        <ArrowRightIcon className={'size-4 hidden md:block'} />
        <input
          type='date'
          value={dates.end.format('YYYY-MM-DD')}
          onChange={(event) => {
            setDates({
              end: dayjs(event.target.value),
              start: dayjs(event.target.value).isBefore(dates.start)
                ? dayjs(event.target.value)
                : dates.start,
            });
          }}
        />
      </div>
      <div className={'flex gap-4 items-center mt-6'}>
        {onCancel && (
          <button className={'warn'} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className={'primary'} onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

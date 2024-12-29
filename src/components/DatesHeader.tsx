import dayjs, { Dayjs, OpUnitType } from 'dayjs';
import { Modal } from './Modal.tsx';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { DateRangeSelection } from './DateRangeSelection.tsx';

const quickDates: OpUnitType[] = ['week', 'month', 'year'];

export const DatesHeader = ({
  dates,
  setDates,
}: {
  dates: {
    start: Dayjs;
    end: Dayjs;
  };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
}) => {
  return (
    <div className={'p-4'}>
      <div className={'mb-4'}>
        <p>This...</p>
        <div className={'flex gap-4'}>
          {quickDates.map((quickDate) => {
            const values = {
              start: dayjs().startOf(quickDate),
              end: dayjs().endOf(quickDate),
            };
            const isSelected =
              values.start.isSame(dates.start, 'day') &&
              values.end.isSame(dates.end, 'day');

            return (
              <button
                key={quickDate}
                onClick={() => {
                  setDates(values);
                }}
                className={`border-b-2 ${isSelected ? 'border-black' : ''}`}
              >
                {quickDate}
              </button>
            );
          })}
        </div>
      </div>
      <Modal
        title={'Edit Dates'}
        trigger={
          <button
            className={'underline text-lg font-bold flex gap-2 items-center'}
          >
            {dates.start.format('MMM D YYYY')}
            {' to '}
            {dates.end.format('MMM DD YYYY')}
            <Pencil1Icon className={'size-5'} />
          </button>
        }
        renderChildren={({ closeModal }) => (
          <DateRangeSelection
            submit={(values) => {
              setDates(values);
              closeModal();
            }}
            initialDates={dates}
            onCancel={closeModal}
          />
        )}
      />
    </div>
  );
};

import { Dayjs } from 'dayjs';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

const quickDates: ('week' | 'month' | 'year')[] = ['week', 'month', 'year'];

export const DatesHeader = ({
  dates,
  setDates,
  updateRange,
}: {
  dates: {
    start: Dayjs;
    end: Dayjs;
    range: 'week' | 'month' | 'year';
  };
  setDates: (dates: { start: Dayjs; end: Dayjs }) => void;
  updateRange: (range: 'week' | 'month' | 'year') => void;
}) => {
  const jumpDates = (amount: 1 | -1) => {
    const start = dates.start.add(amount, dates.range);
    setDates({
      start: start,
      end: start.endOf(dates.range),
    });
  };

  return (
    <div className={'p-4'}>
      <div className={'mb-4'}>
        <p>This...</p>
        <div className={'flex gap-4'}>
          {quickDates.map((quickDate) => {
            const isSelected = dates.range === quickDate;

            return (
              <button
                key={quickDate}
                onClick={() => {
                  updateRange(quickDate);
                }}
                className={`border-b-2 ${isSelected ? 'border-black' : ''}`}
              >
                {quickDate}
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex items-center gap-4 justify-center md:text-lg font-bold'>
        <button
          onClick={() => {
            jumpDates(-1);
          }}
        >
          <span className={'sr-only'}>Previous {dates.range}</span>
          <ArrowLeftIcon className={'size-4'} />
        </button>
        <p>
          {' '}
          {dates.start.format("ddd, MMM D 'YY")}
          {' to '}
          {dates.end.format("ddd, MMM DD 'YY")}
        </p>
        <button
          onClick={() => {
            jumpDates(1);
          }}
        >
          <span className={'sr-only'}>Next {dates.range}</span>
          <ArrowRightIcon className={'size-4'} />
        </button>
      </div>
    </div>
  );
};

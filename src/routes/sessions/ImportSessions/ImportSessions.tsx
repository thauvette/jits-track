import toast from 'react-hot-toast';
import { convertDurationToSeconds } from '../../../utilities/duration.tsx';
import { useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Row } from './Row.tsx';
import { ImportedSession } from './types.ts';
import { useTeammates } from '../../../hooks/useTeammates.ts';

export const ImportSessions = () => {
  const [imported, setImported] = useState<ImportedSession[] | null>(null);
  const [activeImportIndex, setActiveImportIndex] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useTeammates();
  const convertFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (!event.target?.result || typeof event.target.result !== 'string') {
        toast.error('Error parsing file');
        return;
      }
      try {
        const rows = event.target.result.split('\n');
        const headers = rows[0].split(';');
        const sessions = rows.reduce<ImportedSession[]>((arr, row, index) => {
          if (!index) {
            return arr;
          }
          const data = row.split(';');
          // only date is required...
          const date = data[headers.indexOf('date')];
          if (!date) {
            return arr;
          }
          const duration = data[headers.indexOf('duration')];
          const heart = data[headers.indexOf('avg_heart_rate')]
            ? +data[headers.indexOf('avg_heart_rate')]
            : null;
          const calories = data[headers.indexOf('calories')]
            ? +data[headers.indexOf('calories')]
            : null;
          const rolls = data[headers.indexOf('rolls')];
          const nogiRolls = data[headers.indexOf('nogi')];
          const isNogi = !!(nogiRolls && +nogiRolls);
          arr.push({
            date,
            duration: duration ? convertDurationToSeconds(duration) : null,
            coach: data[headers.indexOf('coach')],
            avg_heart_rate: heart,
            calories: calories,
            type: data[headers.indexOf('type')],
            rolls: rolls ? rolls.split(',') : null,
            isNogi,
          });

          return arr;
        }, []);
        setImported(sessions);
      } catch (err) {
        console.log(err);
        toast.error('Error parsing file');
      }
    };
    reader.readAsText(file);
  };
  const reset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setImported(null);
    setIsImporting(false);
    setActiveImportIndex(0);
  };

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl font-bold mb-4'}>Import Sessions</h1>
      {imported ? (
        <div>
          <p>{imported.length} sessions ready to import</p>
          <div className={'flex gap-4 items-center py-4'}>
            <button
              className={'primary'}
              onClick={() => {
                setIsImporting(true);
              }}
            >
              Start Import
            </button>
            <button className={'warn'} onClick={reset}>
              Reset
            </button>
          </div>
          <div className={'grid grid-cols-6 text-sm gap-y-4'}>
            <p>date</p>
            <p>type</p>
            <p>coach</p>
            <p>Rolls</p>
            <p>nogi?</p>

            {imported.map((item, index) => (
              <Row
                item={item}
                key={index}
                isActive={isImporting && index === activeImportIndex}
                onSuccess={() => {
                  if (index + 1 === imported.length) {
                    setIsImporting(false);
                    setActiveImportIndex(0);
                    return;
                  }
                  setActiveImportIndex(index + 1);
                }}
                onError={() => {
                  if (index + 1 === imported.length) {
                    // index = 0, length 2 (0,1),
                    setIsImporting(false);
                    setActiveImportIndex(0);
                    return;
                  }
                  setActiveImportIndex(index + 1);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={'space-y-2'}>
            <p>Upload an csv file to import previous sessions.</p>
            <p>
              Columns must be separated by a {'";"'}. This is because the rolls
              are a comma separated list of names.
            </p>
            <p>The file must have headers with at least a date.</p>
            <p>
              Optional columns (requires a header) are coach, duration
              (hh:mm:ss), avg_heart_rate, calories and a comma separated list of
              rolls by teammate name.
            </p>
          </div>

          <div className={'mt-4 relative'}>
            <input
              type={'file'}
              accept={'text/csv'}
              onChange={(event) => {
                if (event.target?.files?.[0]) {
                  convertFile(event.target.files[0]);
                }
              }}
              ref={inputRef}
            />
            {inputRef?.current?.value ? (
              <button
                className={
                  'absolute right-2 top-1/2 transform -translate-y-1/2'
                }
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }
                }}
              >
                <Cross2Icon />
                <span className={'sr-only'}>Clear</span>
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

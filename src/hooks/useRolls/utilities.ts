import { RollReq } from './types.ts';

export const formatSubsRequest = (
  rolls: RollReq | RollReq[],
  key: 'subsFor' | 'subAgainst',
  data?: { id: number }[],
) => {
  return Array.isArray(rolls)
    ? rolls.reduce<
        {
          roll: number;
          sub: number;
        }[]
      >((arr, roll, index) => {
        const rollId = data?.[index]?.id;
        const subs = roll?.[key];
        if (rollId && subs?.length) {
          subs?.forEach((sub) => {
            arr.push({
              roll: rollId,
              sub,
            });
          });
        }
        return arr;
      }, [])
    : rolls?.[key]?.length && data?.[0]?.id
      ? rolls[key].map((sub) => ({
          sub,
          roll: data?.[0]?.id,
        }))
      : null;
};

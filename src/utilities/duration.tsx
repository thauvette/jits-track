import Big from 'big.js';

export const convertSecondsToDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = Math.round(durationSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const convertDurationToSeconds = (duration: string) => {
  const arr = duration?.split(':') || [];
  const hours = new Big(arr[0] ?? 0).times(3600);
  const minutes = new Big(arr[1] ?? 0).times(60);
  const seconds = new Big(arr[2] ?? 0);
  const result = hours.add(minutes).add(seconds);
  return result.toNumber();
};

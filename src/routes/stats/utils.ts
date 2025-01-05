export const getAverage = (nums: number[]) => {
  if (!nums?.length) {
    return 0;
  }
  const average = nums.reduce((total, num) => total + num, 0) / nums.length;
  if (Number.isInteger(average)) {
    return average;
  }
  return Math.round(average * 100) / 100;
};

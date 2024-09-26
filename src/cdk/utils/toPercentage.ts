/**
 *"toPercentage" helps to convert any numeric value to percentage within a specified range
 * @param min - min value in a specified range
 * @param max - max value in a specified range
 * @param value - the provided value that is needed to be converted to percentage in relation to a specified range
 * @returns
 */
export function toPercentage(min: number, max: number, value: number): number {
  return ((value - min) / (max - min)) * 100;
}

import { isNil } from 'lodash';

import { N_A } from 'src/constants';

const numAbbr = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const numCommas = new Intl.NumberFormat('en-US', { notation: 'standard' });
const moneyWithCommas = new Intl.NumberFormat('en-US', {
  notation: 'standard',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/**
 * Converts number to abbreviated string (e.g 1900000 => 1.9M)
 */
export function numberInAbbrFormat(value?: number | null): string {
  if (isNil(value) || isNaN(value)) {
    return N_A;
  }
  return numAbbr.format(value);
}

/**
 * Converts number to comma-separated string (e.g 1999999 => 1,999,999)
 */
export function numberWithCommasFormat(value?: number | null, precision?: number): string {
  if (isNil(value) || isNaN(value)) {
    return N_A;
  }
  return numCommas.format(Number(value.toFixed(precision)));
}

/**
 * Converts number to comma-separated string with two digits after the dot (e.g 1999999 => 1,999,999.00)
 */
export function moneyWithCommasFormat(value?: number | null, withSymbol = true): string {
  if (isNil(value) || isNaN(value)) {
    return N_A;
  }
  return (withSymbol ? '$' : '') + `${moneyWithCommas.format(value)}`;
}

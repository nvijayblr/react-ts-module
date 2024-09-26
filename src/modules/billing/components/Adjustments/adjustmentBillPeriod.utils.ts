import { addDays, isAfter, isBefore, isSameDay, isWithinInterval, max, startOfDay } from 'date-fns';

import { OptionItem } from 'src/shared/components/Select/interface';

const MAX_MONTH_DAY_NUMBER = 28;

function getDispatchDay(startBillingDate: Date): number {
  return startBillingDate.getDate() > MAX_MONTH_DAY_NUMBER ? 1 : startBillingDate.getDate();
}

/**
 * Generate bill occurence option based on start billing date, current date and amount of required occurences.
 * If amount of occurences is undefined, it will return 'every_bill' option.
 * If amount of occurences is X, it will return 'next_X_bill' option, with end date set to the last day of the billing period.
 */
export function generateBillOccurenceOption(
  startBillingDate: Date,
  currentDate: Date,
  amountOfOccurences?: number
): OptionItem<
  string,
  {
    startDate: Date;
    endDate: Date | null;
  }
> {
  // Define latest date, because lease can start in future,
  // in this case "current date" cannot be used as start date
  const latestDate = max([startBillingDate, currentDate]);

  if (!amountOfOccurences) {
    return {
      key: 'every_bill',
      displayValue: convertBillOccurenceKeyToLabel('every_bill'),
      config: {
        startDate: latestDate,
        endDate: null,
      },
    };
  }

  let i = 0;
  let dispatchDate = latestDate;
  while (i < amountOfOccurences) {
    dispatchDate = generateFutureDispatchDate(startBillingDate, addDays(dispatchDate, 1));
    i += 1;
  }

  const endDate = dispatchDate;
  endDate.setUTCHours(0);
  endDate.setUTCDate(endDate.getUTCDate() - 1);

  const key = `next_${i}_bill`;

  return {
    key,
    displayValue: convertBillOccurenceKeyToLabel(key),
    config: {
      startDate: latestDate,
      endDate,
    },
  };
}

/**
 * Identify bill occurence option based on start billing date, current date and end date.
 * If end date is undefined, it will return 'every_bill' option.
 * If end date is in current billing period, it will return 'next_1_bill' option.
 * If end date is in future, it will return 'next_X_bill' option.
 * If end date is in past, it will return 'next_0_bill' option.
 *
 * Start billing date is used to determine dispatch day.
 * Amount of bills is calculated based on current date.
 */
export function identifyBillOccurenceOption(startBillingDate: Date, currentDate: Date, endDate?: Date | null): string {
  // If no end date
  if (!endDate) {
    return 'every_bill';
  }
  // If lease start billing date is in future, then set current day as lease tart billing date
  const adjustedCurrentDay = max([startBillingDate, currentDate]);
  let dispatchDate = generateFutureDispatchDate(startBillingDate, adjustedCurrentDay);
  // If end date is in past but still in current billing period
  const billingPeriodStart = generatePreviuosDispatchDate(startBillingDate, adjustedCurrentDay);
  if (
    isWithinInterval(endDate, { start: billingPeriodStart, end: addDays(dispatchDate, -1) }) ||
    isSameDay(endDate, dispatchDate)
  ) {
    return 'next_1_bill';
  }
  // If end date is in past and not in current billing period
  if (isBefore(endDate, dispatchDate)) {
    return 'next_0_bill';
  }
  // If end date is in future
  let billingPeriod = isWithinInterval(adjustedCurrentDay, {
    start: billingPeriodStart,
    end: addDays(dispatchDate, -1),
  })
    ? 1
    : 0;
  while (isBefore(dispatchDate, endDate)) {
    dispatchDate = generateFutureDispatchDate(startBillingDate, addDays(dispatchDate, 1));
    billingPeriod += 1;
    if (billingPeriod > 10) {
      // To prevent infinite loop
      break;
    }
  }
  return `next_${billingPeriod}_bill`;
}

/**
 * Convert bill occurence option key to label
 *
 * (e.g.) 'next_1_bill' -> 'Next Bill'
 */
export function convertBillOccurenceKeyToLabel(key: string): string {
  switch (key) {
    case 'every_bill':
      return 'Every Bill';
    case 'next_1_bill':
      return 'Next Bill';
    case 'next_0_bill':
      return 'Past Bill';
    default:
      return `Next ${key.split('_')[1]} Bills`;
  }
}

/**
 * Generate dispatch date for the next billing period after current date
 * or for the current billing period if current date is in it
 */
export function generateFutureDispatchDate(startBillingDate: Date, currentDate: Date): Date {
  const dispatchDay = getDispatchDay(startBillingDate);
  const dispatchDate = new Date(currentDate);
  dispatchDate.setUTCHours(0, 0, 0, 0);
  dispatchDate.setUTCDate(dispatchDay);
  if (isBefore(dispatchDate, currentDate)) {
    dispatchDate.setUTCMonth(dispatchDate.getUTCMonth() + 1);
    dispatchDate.setUTCHours(0, 0, 0, 0);
  }
  return dispatchDate;
}

function generatePreviuosDispatchDate(startBillingDate: Date, currentDate: Date) {
  const dispatchDay = getDispatchDay(startBillingDate);
  const dispatchDate = startOfDay(new Date(currentDate));
  dispatchDate.setUTCHours(0, 0, 0, 0);
  dispatchDate.setUTCDate(dispatchDay);
  if (isAfter(dispatchDate, currentDate) || isSameDay(dispatchDate, currentDate)) {
    dispatchDate.setUTCMonth(dispatchDate.getUTCMonth() - 1);
    dispatchDate.setUTCHours(0, 0, 0, 0);
  }
  return dispatchDate;
}

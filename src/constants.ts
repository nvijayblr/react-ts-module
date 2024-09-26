export const GLOBAL_TIME_INTERVAL = 15; // time in minutes
export const LAST_JS_MONTH = 11;
export const DEFAULT_TZ_FOR_TABLE_COLUMNS = 'America/New_York';

export const DATE_FORMAT = {
  DAY: 'd', // 1
  DAY_SHORT: 'dd', // 01
  WEEKDAY_LONG: 'EEEE', // Tuesday
  WEEKDAY_MEDIUM: 'EEE', // Sun, Mon, ..., Sat
  WEEKDAY_SHORT: 'EEEEEE', // Tu
  HOURS: 'H', // 0 // TODO: Get rid of it, it is used only for data generations
  HOURS_AM_PM: 'h a', // 12 AM // TODO: Get rid of it, it is used only for data generations (use HOURS_PER_DAY)
  HOURS_MINUTES_AM_PM: 'h:mm a', // 12:00 AM
  HOURS_AM_PM_SHORT: 'haaaaa', // 12a
  MONTH_SHORT: 'MMM', // Feb
  MONTH_FULL: 'MMMM',
  YEAR_FULL: 'yyyy',
  MONTH_DAY_NUMBER: 'M/d', // 2/1 // TODO: use MONTH_DAY_SHORT
  MONTH_DAY_SHORT: 'MMM dd', // Feb 01
  MONTH_DAY_SHORTER: 'MMM d', // Feb 1 // TODO: Maybe use MONTH_DAY_SHORT ?
  MONTH_YEAR_FULL_COMMA: 'MMMM, yyyy', // February, 2022
  MONTH_YEAR_SHORT_COMMA: 'MMM, yyyy', // Feb, 2022
  MONTH_YEAR_FULL: 'MMMM yyyy', // February 2022
  MONTH_YEAR_SHORT: 'MMM yyyy', // Feb 2022
  DATE_NUMBERS_SHORT: 'M/d/yy', // 2/1/22
  DATE_NUMBERS: 'MM/dd/yyyy', // 02/01/2022 // TODO: Maybe use DATE_NUMBERS_SHORT ?
  DATE_SHORT: 'MMM dd, yyyy', // Feb 01, 2022
  DATE_FULL: 'MMMM dd, y', // February 01, 2022
  DATE_TIME_FULL: 'MMMM dd, y p', // February 01, 2022 12:00 AM
  DATE_TIME_SHORT: 'MMMM dd, p', // February 01, 12:00 AM
  DATE_YEAR_TIME_SHORT: 'MMM dd, yyyy p', // Feb 01, 2022 12:00 AM
  LOCAL_TIME: 'p', // 12:00 AM
  TIMESTAMP_WITH_TZ: 'yyyy-MM-dd HH:mm:SS O', // 2022-02-01 00:00:00 GMT+2
  TIMESTAMP_WITHOUT_TZ: 'MM/dd/yyyy HH:mm:ss X', // 2022-02-01 00:00:00 Z
  TIMESTAMP_LOCAL_TZ: 'MM/dd/yyyy HH:mm:ss', // 01/02/2022 00:00:00
  FULL_DATE_GLUED: 'yyyyMMdd',
};

// Time breakpoints
export const ONE_SECOND_MS = 1000;
export const HALF_SECOND_MS = 500;
export const ONE_MINUTE_MS = ONE_SECOND_MS * 60;

export const N_A = '-';

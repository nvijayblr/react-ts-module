import {
  FanType,
  LockType,
  MetricsMeasurementType,
  ModeType,
  SpaceType,
  SystemGroupType,
  SystemType,
  WeekDays,
} from './core/apollo/__generated__/resourcesGlobalTypes';
import { UserRoles } from './core/apollo/__generated__/usersGlobalTypes';
import { UtilityServiceTypes } from './core/apollo/__generated__/utilityGlobalTypes';
import { NumberRange, PackagedSystemSettings } from './interfaces';

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

// Units
export enum UNIT {
  FAHRENHEIT = '°F',
  PSI = 'psi',
  PERCENTAGE = '%',
  PPM = 'ppm',
  PPB = 'ppb',
  MICROGRAM_M3 = 'µg/m3',
  MINUTES = 'min',
  KBTU = 'kBtu',
  DOLLARS = 'USD',
  TONNES = 'mt',
  NUMBER = '',
  METRIC_TONNES_CO2_EMISSION = 'tCO2e',
  SQUARE_FEET = 'ft2',
  OF_HUNDRED = 'of 100',
  WH = 'Wh', // watts per hour
  KWH = 'kWh',
  KW = 'kW',
  KVAR = 'kVAR',
  DEGREES = 'deg',
  HECTO_PASCAL = 'hPa',
  METERS_PER_SECOND = 'm/s',
  MILLIMETER = 'mm',
  MILES_PER_HOUR = 'mph',
  CUBIC_FEET = 'ft3',
  GALLONS = 'gal',
  LITERS = 'L',
  BARRELS = 'bbl',
  POUNDS_PER_HOUR = 'lb/h',
  HUNDRED_CUBIC_FEET = 'HCF',
  MILLION_POUNDS = 'Mlb',
  THERMS = 'Therms', // In future we may return to `thm` abbreviation
  TOTAL = 'Total',
  THERMS_PER_HOUR = 'Therms/h',
  MILLION_POUNDS_PER_HOUR = 'Mlb/h',
  HCF_PER_HOUR = 'HCF/h',
}

export const METRIC_SYMBOL: Record<MetricsMeasurementType, UNIT> = {
  [MetricsMeasurementType.DBA]: UNIT.NUMBER,
  [MetricsMeasurementType.LUX]: UNIT.NUMBER,
  [MetricsMeasurementType.PSI]: UNIT.PSI,
  [MetricsMeasurementType.FAHRENHEIT]: UNIT.FAHRENHEIT,
  [MetricsMeasurementType.PERCENTAGE]: UNIT.PERCENTAGE,
  [MetricsMeasurementType.PPB]: UNIT.PPB,
  [MetricsMeasurementType.PPM]: UNIT.PPM,
  [MetricsMeasurementType.MICROGRAM_M3]: UNIT.MICROGRAM_M3,
  [MetricsMeasurementType.USAGE]: UNIT.MINUTES,
  [MetricsMeasurementType.KBTU]: UNIT.KBTU,
  [MetricsMeasurementType.USD]: UNIT.DOLLARS,
  [MetricsMeasurementType.METRIC_TON]: UNIT.TONNES,
  [MetricsMeasurementType.NUMERIC]: UNIT.NUMBER,
  [MetricsMeasurementType.KVAR]: UNIT.KVAR,
  [MetricsMeasurementType.KW]: UNIT.KW,
  [MetricsMeasurementType.KWH]: UNIT.KWH,
  [MetricsMeasurementType.WH]: UNIT.WH,
  [MetricsMeasurementType.DEGREES]: UNIT.DEGREES,
  [MetricsMeasurementType.HECTO_PASCAL]: UNIT.HECTO_PASCAL,
  [MetricsMeasurementType.METERS_PER_SECOND]: UNIT.METERS_PER_SECOND,
  [MetricsMeasurementType.MILLIMETER]: UNIT.MILLIMETER,
  [MetricsMeasurementType.MILES_PER_HOUR]: UNIT.MILES_PER_HOUR,
  [MetricsMeasurementType.FT3]: UNIT.CUBIC_FEET,
  [MetricsMeasurementType.HCF]: UNIT.HUNDRED_CUBIC_FEET,
  [MetricsMeasurementType.MILLION_POUNDS]: UNIT.MILLION_POUNDS,
  [MetricsMeasurementType.THERMS]: UNIT.THERMS,
  [MetricsMeasurementType.THERMS_PER_HOUR]: UNIT.THERMS_PER_HOUR,
  [MetricsMeasurementType.MILLION_POUNDS_PER_HOUR]: UNIT.MILLION_POUNDS_PER_HOUR,
  [MetricsMeasurementType.HCF_PER_HOUR]: UNIT.HCF_PER_HOUR,
};

export const MAP_UTILITY_TYPE_TO_UNIT: Record<UtilityServiceTypes, UNIT> = {
  [UtilityServiceTypes.ELECTRIC]: UNIT.KWH,
  [UtilityServiceTypes.GAS]: UNIT.THERMS,
  [UtilityServiceTypes.STEAM]: UNIT.MILLION_POUNDS,
  [UtilityServiceTypes.FUEL_OIL]: UNIT.GALLONS,
  [UtilityServiceTypes.OTHER]: UNIT.NUMBER,
  [UtilityServiceTypes.WASTE]: UNIT.HUNDRED_CUBIC_FEET,
  [UtilityServiceTypes.WATER]: UNIT.HUNDRED_CUBIC_FEET,
};

/**
 * Define precision for each unit.
 * If precision is not defined, raw value will be displayed for backward compatibility
 */
export const UNIT_PRECISION = {
  [UNIT.METERS_PER_SECOND]: 1,
  [UNIT.MILES_PER_HOUR]: 1,
  [UNIT.KWH]: 1,
  [UNIT.KW]: 1,
  [UNIT.WH]: 1,
  [UNIT.KVAR]: 1,
  [UNIT.PERCENTAGE]: 1,
  [UNIT.PPM]: 1,
  [UNIT.MICROGRAM_M3]: 1,
};

// TODO: Replace Packaged_Systems variable to Air_Handling_Unit variables
export const OAT_MIN = 0;
export const OAT_MAX = 65;
export const PACKAGED_SYSTEM_SETPOINT_MIN = 50;
export const PACKAGED_SYSTEM_SETPOINT_MAX = 90;
export const START_OF_DAY = 0;
export const NUM_OF_HOURS_IN_DAY = 24;

/**
 * Order is based on JS doc
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
 */
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WEEKDAYS_ENUM_VALUES = [
  WeekDays.SUNDAY,
  WeekDays.MONDAY,
  WeekDays.TUESDAY,
  WeekDays.WEDNESDAY,
  WeekDays.THURSDAY,
  WeekDays.FRIDAY,
  WeekDays.SATURDAY,
];

export const WEEKDAY_NUMBERS = [0, 1, 2, 3, 4, 5, 6];

export const MONTH_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const HOURS_PER_DAY = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
  '12 AM',
];

export const OAT_RESET_LIMITS: NumberRange = [OAT_MIN, OAT_MAX];

export function getSetpointText(type: SystemType): string {
  switch (type) {
    case SystemType.STEAM_PRV_STATION:
      return `Setpoint (${UNIT.PSI})`;
    case SystemType.ST_BOILER_F_HT_MPC:
    case SystemType.HW_BOILER_HT_HWR:
    case SystemType.HW_BOILER_TEKMAR_284:
      return `Setpoint (${UNIT.FAHRENHEIT})`;
    case SystemType.LUTRON_VIVE_LIGHTING:
      return 'Light Intensity';
    default:
      return '';
  }
}

export function getSetpointResetText(type: SystemType): string {
  switch (type) {
    case SystemType.STEAM_PRV_STATION:
      return `Outlet Pressure (${UNIT.PSI})`;
    case SystemType.ST_BOILER_F_HT_MPC:
    case SystemType.HW_BOILER_HT_HWR:
    case SystemType.HW_BOILER_TEKMAR_284:
      return `Supply Temperature (${UNIT.FAHRENHEIT})`;
    default:
      return '';
  }
}

export function getSetpointLimits(type: SystemType): NumberRange {
  switch (type) {
    case SystemType.STEAM_PRV_STATION:
      return [0, 15];
    case SystemType.ST_BOILER_F_HT_MPC:
      return [0, 240];
    case SystemType.HW_BOILER_HT_HWR:
    case SystemType.HW_BOILER_TEKMAR_284:
      return [110, 180];
    case SystemType.LUTRON_VIVE_LIGHTING:
      return [0, 100];
    default:
      return [0, 0];
  }
}

export const defaultPackagedSystemSettings: PackagedSystemSettings = {
  setpointMax: PACKAGED_SYSTEM_SETPOINT_MAX,
  setpointMin: PACKAGED_SYSTEM_SETPOINT_MIN,
  mode: ModeType.AUTO,
  fan: FanType.AUTO,
  space: SpaceType.UNOCCUPIED,
  occupiedSetpointCool: 72,
  occupiedSetpointHeat: 68,
  unoccupiedSetpointCool: 72,
  unoccupiedSetpointHeat: 68,
  setLock: LockType.UNLOCKED,
};

export const systemGroupTypeToLabel: Record<SystemGroupType, string> = {
  [SystemGroupType.STEAM_PRV]: 'Steam PRV Station',
  [SystemGroupType.STEAM_BOILER]: 'Boiler',
  [SystemGroupType.TBL_TCI]: 'IEQ',
  [SystemGroupType.AIR_HANDLING_UNIT]: 'Air Handling Unit',
  [SystemGroupType.LIGHTING_SYSTEM]: 'Lighting System',
  [SystemGroupType.SUBMETER]: 'Submeters',
  [SystemGroupType.METER]: 'Meters',
  [SystemGroupType.WEATHER_STATION]: 'Weather Station',
  [SystemGroupType.SMART_OUTLET]: 'Outlet System',
  [SystemGroupType.CHARGE_POINT]: 'Charge Station', // TODO: rename API group type to Charge Station
};

export const SystemTypesWithGroups = [SystemType.LUTRON_VIVE_LIGHTING, SystemType.SMART_OUTLET_T0006623];
export const SystemGroupTypesWithGroups = [SystemGroupType.LIGHTING_SYSTEM, SystemGroupType.SMART_OUTLET];
export const SystemTypesForSchedule = [
  SystemType.HW_BOILER_HT_HWR,
  SystemType.HW_BOILER_TEKMAR_284,
  SystemType.PACKAGE_ALTC24PROG,
  SystemType.PACKAGE_ECOBEE_DEFAULT,
  SystemType.PACKAGE_HONEYWELL_TC500AN,
  SystemType.STEAM_PRV_STATION,
  SystemType.ST_BOILER_F_HT_MPC,
  SystemType.LUTRON_VIVE_LIGHTING,
  SystemType.SMART_OUTLET_T0006623,
];

export const SquareIconMetricsMeasurementType = [
  MetricsMeasurementType.USAGE,
  MetricsMeasurementType.KWH,
  MetricsMeasurementType.KBTU,
  MetricsMeasurementType.USD,
  MetricsMeasurementType.METRIC_TON,
  MetricsMeasurementType.NUMERIC,
];

export const NonTenantUserRoles: UserRoles[] = [
  UserRoles.SUPER_ADMIN,
  UserRoles.ADMIN,
  UserRoles.MANAGER,
  UserRoles.OPERATOR,
];

export const TAX_CHARGE_NAME = 'Tax';

const url = process.env['REACT_APP_REST_export'];
if (!url) {
  throw new Error(`Missing REACT_APP_REST_export env variable`);
}
export const FILE_DOWNLOAD_URL = `${url}/download`;

import { ONE_MINUTE_MS, ONE_SECOND_MS, UNIT } from './constants';
import { AlertColor } from './core/apollo/__generated__/alertsGlobalTypes';
import { GatewayVersion } from './core/apollo/__generated__/iotGlobalTypes';
import {
  FanType,
  FloorType,
  MetricsMeasurementType,
  MetricType,
  ModeType,
  SensorDeviceType,
  SitePrimaryPropertyType,
  SpaceStatus,
  SpaceType,
  OnlineStatus,
  SystemType,
} from './core/apollo/__generated__/resourcesGlobalTypes';
import { UserRoles } from './core/apollo/__generated__/usersGlobalTypes';
import { OptionItem } from './shared/components/Select';

export enum SupportedColors {
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
  Grey = 'grey',
  DarkBlue = 'dark-blue',
  Blue = 'blue',
}

export enum MapMarkerColor {
  Red = '#e55252',
  RedTranslucent = '#e5525266',
  Blue = '#5fa7da',
  BlueTranslucent = '#5fa7da66',
  Yellow = '#ffd73a',
  YellowTranslucent = '#ffd73a66',
  Orange = '#ec9439',
  OrangeTranslucent = '#ec943966',
  DarkBlue = '#5a68e2',
  DarkBlueTranslucent = '#5a68e266',
  Green = '#5bc784',
  GreenTranslucent = '#5bc78466',
  White = '#e0e0e0',
  WhiteTranslucent = '#e0e0e066',
  Black = '#141417',
  BlackTranslucent = '#14141766',
  Grey = '#303033',
}

export enum LoadingState {
  WAITING,
  LOADING,
  FAILED,
}

export enum SortingType {
  Ascending = 'asc',
  Descending = 'desc',
}

export enum PersistentStorageKeys {
  SelectedSites = 'selectedSites',
  SelectedSystemsMetrics = 'selectedSystemsMetrics',
  SelectedSystemLayout = 'selectedSystemLayout',
  ExpandedAndFixedNavBar = 'ExpandedAndFixedNavBar',
  ConedOruMaidId = 'coned-oru-maid-id',
  SpaceTemperatureRules = 'space-temperature-rules',
}

export enum LoadingStatus {
  INITIAL,
  WAITING,
  LOADED,
  FAILED,
}

export enum SystemSequence {
  Manual = 300,
  Local = 400,
  OATReset = 500,
  SpaceTemperatureReset = 600,
  DemandResponse = 700,
  DemandResponsePreEvent = 800,
}

export const sequenceDisplayValue: Record<SystemSequence, string> = {
  [SystemSequence.Local]: 'Local',
  [SystemSequence.Manual]: 'Manual',
  [SystemSequence.OATReset]: 'Outside Air Temp. Reset',
  [SystemSequence.SpaceTemperatureReset]: 'Space Temperature Reset',
  [SystemSequence.DemandResponse]: 'Curtailment',
  [SystemSequence.DemandResponsePreEvent]: 'Precurtailment',
};

export const sequenceColor: Record<SystemSequence, SupportedColors> = {
  [SystemSequence.Local]: SupportedColors.Grey,
  [SystemSequence.Manual]: SupportedColors.Orange,
  [SystemSequence.OATReset]: SupportedColors.DarkBlue,
  [SystemSequence.SpaceTemperatureReset]: SupportedColors.Red,
  [SystemSequence.DemandResponse]: SupportedColors.Grey,
  [SystemSequence.DemandResponsePreEvent]: SupportedColors.Grey,
};

export const packageModeDisplayValue: Record<ModeType, string> = {
  [ModeType.FAN_ONLY]: 'Fan Only',
  [ModeType.COOL]: 'Cool',
  [ModeType.HEAT]: 'Heat',
  [ModeType.AUTO]: 'Auto',
  [ModeType.OFF]: 'Off',
  [ModeType.EMERGENCY_HEAT]: 'Emergency Heat',
  [ModeType.FREEZE_PROTECTION]: 'Freeze Protection',
  [ModeType.SERVICE_MODE]: 'Service Mode',
  [ModeType.SMOKE_EMERGENCY]: 'Smoke Emerg.', // Smoke Emergency
  [ModeType.STARTUP_WAIT]: 'Startup Wait',
};

export const packageFanDisplayValue: Record<FanType, string> = {
  [FanType.LOW]: 'Low',
  [FanType.MEDIUM]: 'Medium',
  [FanType.HIGH]: 'High',
  [FanType.AUTO]: 'Auto',
  [FanType.OFF]: 'Off',
  [FanType.CONTINUOUS]: 'Continuous',
  [FanType.FAN_CIRCULATE]: 'Fan Circulate',
  [FanType.ON]: 'On',
};

export const packageSpaceDisplayValue: Record<SpaceType, string> = {
  [SpaceType.OCCUPIED]: 'Occupied',
  [SpaceType.UNOCCUPIED]: 'Unoccupied',
  [SpaceType.BYPASS]: 'Bypass',
  [SpaceType.STANDBY]: 'Stand by',
  [SpaceType.NULL]: 'Null',
  [SpaceType.NO_OVERRIDE]: 'No Override',
};

export const systemTypeToSequenceMap: Record<SystemType, SystemSequence[]> = {
  [SystemType.STEAM_PRV_STATION]: [SystemSequence.Manual, SystemSequence.OATReset],
  [SystemType.HW_BOILER_TEKMAR_284]: [SystemSequence.Manual, SystemSequence.OATReset],
  [SystemType.ST_BOILER_F_HT_MPC]: [SystemSequence.Manual, SystemSequence.OATReset],
  [SystemType.TBL_TCI]: [],
  [SystemType.HW_BOILER_HT_HWR]: [SystemSequence.Manual, SystemSequence.OATReset],
  [SystemType.PACKAGE_ECOBEE_DEFAULT]: [SystemSequence.Manual],
  [SystemType.PACKAGE_HONEYWELL_TC500AN]: [SystemSequence.Manual],
  [SystemType.PACKAGE_ALTC24PROG]: [SystemSequence.Manual],
  [SystemType.LUTRON_VIVE_LIGHTING]: [SystemSequence.Manual],
  [SystemType.ELECTRICITY_SUBMETER]: [],
  [SystemType.ELECTRICITY_METER]: [],
  [SystemType.NATURAL_GAS_METER]: [],
  [SystemType.STEAM_METER]: [],
  [SystemType.WATER_METER]: [],
  [SystemType.WEATHER_STATION_WTS506]: [],
  [SystemType.SMART_OUTLET_T0006623]: [SystemSequence.Manual],
  [SystemType.CHARGE_POINT]: [],
};

export enum ColorConfig {
  blueSolidOpaque = 'blue-solid-opaque',
  blueDashedOpaque = 'blue-dashed-opaque',
  blueDottedOpaque = 'blue-dotted-opaque',
  blueSolidTranslucent = 'blue-solid-translucent',
  blueDashedTranslucent = 'blue-dashed-translucent',
  blueDottedTranslucent = 'blue-dotted-translucent',

  redSolidOpaque = 'red-solid-opaque',
  redDashedOpaque = 'red-dashed-opaque',
  redDottedOpaque = 'red-dotted-opaque',
  redSolidTranslucent = 'red-solid-translucent',
  redDashedTranslucent = 'red-dashed-translucent',
  redDottedTranslucent = 'red-dotted-translucent',

  orangeSolidOpaque = 'orange-solid-opaque',
  orangeDashedOpaque = 'orange-dashed-opaque',
  orangeDottedOpaque = 'orange-dotted-opaque',
  orangeSolidTranslucent = 'orange-solid-translucent',
  orangeDashedTranslucent = 'orange-dashed-translucent',
  orangeDottedTranslucent = 'orange-dotted-translucent',

  darkBlueSolidOpaque = 'dark-blue-solid-opaque',
  darkBlueDashedOpaque = 'dark-blue-dashed-opaque',
  darkBlueDottedOpaque = 'dark-blue-dotted-opaque',
  darkBlueSolidTranslucent = 'dark-blue-solid-translucent',
  darkBlueDashedTranslucent = 'dark-blue-dashed-translucent',
  darkBlueDottedTranslucent = 'dark-blue-dotted-translucent',

  greenSolidOpaque = 'green-solid-opaque',
  greenDashedOpaque = 'green-dashed-opaque',
  greenDottedOpaque = 'green-dotted-opaque',
  greenSolidTranslucent = 'green-solid-translucent',
  greenDashedTranslucent = 'green-dashed-translucent',
  greenDottedTranslucent = 'green-dotted-translucent',

  whiteSolidOpaque = 'white-solid-opaque',
  whiteDashedOpaque = 'white-dashed-opaque',
  whiteDottedOpaque = 'white-dotted-opaque',
  whiteSolidTranslucent = 'white-solid-translucent',
  whiteDashedTranslucent = 'white-dashed-translucent',
  whiteDottedTranslucent = 'white-dotted-translucent',
}

export const ColorConfigMap: Record<string, string> = {
  [ColorConfig.blueSolidOpaque]: MapMarkerColor.Blue,
  [ColorConfig.redSolidOpaque]: MapMarkerColor.Red,
  [ColorConfig.greenSolidOpaque]: MapMarkerColor.Green,
  [ColorConfig.orangeSolidOpaque]: MapMarkerColor.Orange,
  [ColorConfig.darkBlueSolidOpaque]: MapMarkerColor.DarkBlue,
  [ColorConfig.whiteSolidOpaque]: MapMarkerColor.White,
  [ColorConfig.blueSolidTranslucent]: MapMarkerColor.BlueTranslucent,
  [ColorConfig.redSolidTranslucent]: MapMarkerColor.RedTranslucent,
  [ColorConfig.greenSolidTranslucent]: MapMarkerColor.GreenTranslucent,
  [ColorConfig.orangeSolidTranslucent]: MapMarkerColor.OrangeTranslucent,
  [ColorConfig.darkBlueSolidTranslucent]: MapMarkerColor.DarkBlueTranslucent,
  [ColorConfig.whiteSolidTranslucent]: MapMarkerColor.WhiteTranslucent,
};

export const ColorConfigToOpacityMap: Record<string, number> = {
  [ColorConfig.blueSolidOpaque]: 1,
  [ColorConfig.redSolidOpaque]: 1,
  [ColorConfig.greenSolidOpaque]: 1,
  [ColorConfig.orangeSolidOpaque]: 1,
  [ColorConfig.darkBlueSolidOpaque]: 1,
  [ColorConfig.whiteSolidOpaque]: 1,
  [ColorConfig.blueSolidTranslucent]: 0.5,
  [ColorConfig.redSolidTranslucent]: 0.5,
  [ColorConfig.greenSolidTranslucent]: 0.5,
  [ColorConfig.orangeSolidTranslucent]: 0.5,
  [ColorConfig.darkBlueSolidTranslucent]: 0.5,
  [ColorConfig.whiteSolidTranslucent]: 0.5,
};

export enum TableRecordsCount {
  TEN = 10,
  FIFTY = 50,
}

export const MeasurementToTitle: Record<MetricsMeasurementType, string> = {
  [MetricsMeasurementType.DBA]: 'Unknown',
  [MetricsMeasurementType.LUX]: 'Unknown',
  [MetricsMeasurementType.FAHRENHEIT]: 'Temperature',
  [MetricsMeasurementType.PPM]: 'Parts per million',
  [MetricsMeasurementType.PPB]: 'Parts per billion',
  [MetricsMeasurementType.PSI]: 'Pressure',
  [MetricsMeasurementType.PERCENTAGE]: 'Percentage',
  [MetricsMeasurementType.MICROGRAM_M3]: 'Concentration',
  [MetricsMeasurementType.USAGE]: 'Usage',
  [MetricsMeasurementType.KBTU]: 'Energy',
  [MetricsMeasurementType.USD]: 'USD',
  [MetricsMeasurementType.METRIC_TON]: 'Metric Ton',
  [MetricsMeasurementType.NUMERIC]: '',
  [MetricsMeasurementType.KVAR]: UNIT.KVAR,
  [MetricsMeasurementType.KW]: UNIT.KW,
  [MetricsMeasurementType.KWH]: UNIT.KWH,
  [MetricsMeasurementType.WH]: UNIT.WH,
  [MetricsMeasurementType.DEGREES]: 'Degrees',
  [MetricsMeasurementType.HECTO_PASCAL]: 'Pressure',
  [MetricsMeasurementType.METERS_PER_SECOND]: 'Speed',
  [MetricsMeasurementType.MILLIMETER]: 'Measurement',
  [MetricsMeasurementType.MILES_PER_HOUR]: 'Speed',
  [MetricsMeasurementType.FT3]: UNIT.CUBIC_FEET,
  [MetricsMeasurementType.HCF]: UNIT.HUNDRED_CUBIC_FEET,
  [MetricsMeasurementType.MILLION_POUNDS]: UNIT.MILLION_POUNDS,
  [MetricsMeasurementType.THERMS]: UNIT.THERMS,
  [MetricsMeasurementType.THERMS_PER_HOUR]: UNIT.THERMS_PER_HOUR,
  [MetricsMeasurementType.MILLION_POUNDS_PER_HOUR]: UNIT.MILLION_POUNDS_PER_HOUR,
  [MetricsMeasurementType.HCF_PER_HOUR]: UNIT.HCF_PER_HOUR,
};

export const SystemTypeToTitle: Record<SystemType, string> = {
  [SystemType.HW_BOILER_HT_HWR]: 'HW Boiler HWR',
  [SystemType.HW_BOILER_TEKMAR_284]: 'HW Boiler 284',
  [SystemType.PACKAGE_ALTC24PROG]: 'Air Handling Unit',
  [SystemType.PACKAGE_ECOBEE_DEFAULT]: 'Air Handling Unit Ecobee',
  [SystemType.PACKAGE_HONEYWELL_TC500AN]: 'Air Handling Unit Honeywell',
  [SystemType.STEAM_PRV_STATION]: 'Steam PRV Station',
  [SystemType.ST_BOILER_F_HT_MPC]: 'Steam Boiler',
  [SystemType.TBL_TCI]: 'TBL TCI',
  [SystemType.LUTRON_VIVE_LIGHTING]: 'Lighting System Lutron',
  [SystemType.ELECTRICITY_SUBMETER]: 'Electricity Submeter',
  [SystemType.ELECTRICITY_METER]: 'Electricity Meter',
  [SystemType.NATURAL_GAS_METER]: 'Natural Gas Meter',
  [SystemType.STEAM_METER]: 'Steam Meter',
  [SystemType.WATER_METER]: 'Water Meter',
  [SystemType.WEATHER_STATION_WTS506]: 'Weather Station WTS506',
  [SystemType.SMART_OUTLET_T0006623]: 'Smart Outlet',
  [SystemType.CHARGE_POINT]: 'Charge Point',
};

export const OnlineStatusToTitle: Record<OnlineStatus, string> = {
  [OnlineStatus.OFFLINE]: 'Offline',
  [OnlineStatus.NOT_CONFIGURED]: 'Not Configured',
  [OnlineStatus.ONLINE]: 'No Alerts',
};

export const SYSTEM_ONLINE_STATUS_TO_DESCRIPTION: Record<OnlineStatus, string> = {
  [OnlineStatus.OFFLINE]: 'Orion lost connection to the system due to network or power related issues.',
  // TODO: Add more customizations in future, because it may be different for different system types
  // [SystemAlerts.INEFFICIENT_SYSTEM]:
  //   'Cool setpoint is less than or equal to Heat setpoint, resulting in a deadband that is negative or zero. If space temperature reaches this deadband, the system will both cool and heat.',
  [OnlineStatus.NOT_CONFIGURED]: 'System is not mapped to a device. Please contact Admin.',
  [OnlineStatus.ONLINE]: '',
  // TODO: TBD what to do here?
  // [SystemAlerts.FILTER_RESET_NEEDED]:
  //   'The system triggered an alert to change the filter. If filters are not periodically changed, dust and debris may circulate the space and system airflow may be impeded.',
};

export enum ColorType {
  DEFAULT,
  LIGHT_WARNING,
  WARNING,
  ERROR,
}

export const ALERT_COLOR_TO_COLOR_TYPE: Record<AlertColor, ColorType> = {
  [AlertColor.GREEN]: ColorType.DEFAULT,
  [AlertColor.YELLOW]: ColorType.LIGHT_WARNING,
  [AlertColor.ORANGE]: ColorType.WARNING,
  [AlertColor.RED]: ColorType.ERROR,
};

export const ALERT_ICON_COLOR_BY_COLOR_TYPE: Record<ColorType, 'tertiary' | 'orange' | 'yellow' | 'red'> = {
  [ColorType.DEFAULT]: 'tertiary',
  [ColorType.LIGHT_WARNING]: 'yellow',
  [ColorType.WARNING]: 'orange',
  [ColorType.ERROR]: 'red',
};

/**
 * That key is used to store last opened expanded site accordeon
 */
export enum EXPANDED_SITE_ACCORDEON {
  BOILERS = 'EXPANDED_SITE_ACCORDEON_BOILERS',
  PRV = 'EXPANDED_SITE_ACCORDEON_PRV',
  WEATHER = 'EXPANDED_SITE_ACCORDEON_WEATHER',
  PACKAGED = 'EXPANDED_SITE_ACCORDEON_PACKAGED',
  LIGHTING = 'EXPANDED_SITE_ACCORDEON_LIGHTING',
  OUTLET = 'EXPANDED_SITE_ACCORDEON_OUTLET',
}

export const UsageMetricsPreferredColor: Record<string, ColorConfig> = {
  [MetricType.FAN]: ColorConfig.greenSolidOpaque,
  [MetricType.COOLING]: ColorConfig.blueSolidOpaque,
  [MetricType.COOLING_2]: ColorConfig.darkBlueSolidOpaque,
  [MetricType.COOLING_3]: ColorConfig.darkBlueSolidOpaque,
  [MetricType.HEATING]: ColorConfig.orangeSolidOpaque,
  [MetricType.HEATING_2]: ColorConfig.redSolidOpaque,
  [MetricType.HEATING_3]: ColorConfig.redSolidOpaque,
  [MetricType.LIGHT]: ColorConfig.greenSolidOpaque,
  [MetricType.OCCUPANCY]: ColorConfig.orangeSolidOpaque,
};

export enum UserPermission {
  REGION = 'REGION',
  SITE = 'SITE',
  SYSTEMS = 'SYSTEMS',
}

export enum SpaceTemperatureComparison {
  GREATER_THEN = 'Greater than',
  EQUALS = 'Equals',
  LESS_THAN = 'Lower than',
}

export enum SystemAlertsState {
  HAS_ALERTS,
  NO_ALERTS,
}

export const SitePrimaryPropertyTypeToLabel: Record<SitePrimaryPropertyType, string> = {
  [SitePrimaryPropertyType.COMMERCIAL]: 'Commercial',
  [SitePrimaryPropertyType.INDUSTRIAL]: 'Industrial',
  [SitePrimaryPropertyType.MIXED_USE]: 'Mixed use',
  [SitePrimaryPropertyType.MULTIFAMILY_HOUSING]: 'Multifamily',
  [SitePrimaryPropertyType.RETAIL]: 'Retail',
};

export const recordsShowOptions: OptionItem<number>[] = [
  { key: TableRecordsCount.TEN, displayValue: '10' },
  { key: TableRecordsCount.FIFTY, displayValue: '50' },
];

export const FloorTypeToLabel: Record<FloorType, string> = {
  [FloorType.NO_FLOOR]: 'No Floor',
  [FloorType.ROOF]: 'Roof',
  [FloorType.NUMBER]: 'Number',
  [FloorType.MEZZANINE]: 'Mezzanine',
  [FloorType.LOBBY]: 'Lobby',
  [FloorType.SUBCELLAR]: 'Subcellar',
  [FloorType.BASEMENT]: 'Basement',
  [FloorType.CELLAR]: 'Cellar',
};

export enum TimeIntervalInMs {
  ONE_SECOND = ONE_SECOND_MS,
  ONE_MINUTE = ONE_MINUTE_MS,
}

export const SensorTypeToTitle: Record<SensorDeviceType, string> = {
  [SensorDeviceType.TEMPERATURE_HUMIDITY]: 'Temperature and Humidity Sensor',
  [SensorDeviceType.PRESSURE]: 'Pressure Sensor',
  [SensorDeviceType.SPACE_TEMPERATURE]: 'Temperature Sensor',
  [SensorDeviceType.WATER_FLOW]: 'Water Flow Sensor',
  [SensorDeviceType.DAMPER_EXPECTED]: 'Damper Expected Sensor',
  [SensorDeviceType.DAMPER_EFFECTIVE]: 'Damper Effective Sensor',
};

export enum DownloadDataType {
  CSV = 'CSV',
}

export const ROLE_RANK: Record<UserRoles, number> = {
  [UserRoles.MANAGER]: 0,
  [UserRoles.OPERATOR]: 0,
  [UserRoles.TENANT]: 0,
  [UserRoles.ADMIN]: 1,
  [UserRoles.SUPER_ADMIN]: 2,
};

export enum FilterOptions {
  NONE = '',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUAL_TO = '=',
}

export const SupportedColorsToColorConfigMap: Record<SupportedColors, ColorConfig> = {
  [SupportedColors.Red]: ColorConfig.redSolidOpaque,
  [SupportedColors.Orange]: ColorConfig.orangeSolidOpaque,
  [SupportedColors.DarkBlue]: ColorConfig.darkBlueSolidOpaque,
  [SupportedColors.Blue]: ColorConfig.blueSolidOpaque,
  [SupportedColors.Green]: ColorConfig.greenSolidOpaque,
  [SupportedColors.Grey]: ColorConfig.whiteSolidTranslucent,
};

// If key has `/` in the end, it means that it is a prefix for the key
// and unique ID should be passed as `FilterStorageKey.Electricity + siteID`.
// Such keys should have entity identifier in their name like `SubmetersPerSite`.
//
// Otherwise, it is a full key and should be used as is.
export enum FilterStorageKey {
  SubmetersPerSite = 'ElectricityFilter/', // Also used for billing
  AirQualityPerSite = 'AirQualityFilter/',
  SiteManagement = 'SiteManagementFilter/',
  AdminDevices = 'AdminDevices/',
}

export const SpaceStatusToLabel: Record<SpaceStatus, string> = {
  [SpaceStatus.COMMON]: 'Common',
  [SpaceStatus.MANAGEMENT]: 'Management',
  [SpaceStatus.OCCUPIED]: 'Occupied',
  [SpaceStatus.VACANT]: 'Vacant',
};

export const GatewayTypeToTitle: Record<GatewayVersion, string> = {
  [GatewayVersion.TBL_V1]: 'TBL V1',
  [GatewayVersion.TBL_V2]: 'TBL V2',
  [GatewayVersion.AWS_IOT_LORAWAN]: 'AWS IoT LoRaWAN',
};

export enum GatewayFileType {
  CONFIGURATION = 'Configuration',
  WIRING_DIAGRAM = 'Wiring Diagram',
  INSTALLATION_PHOTO = 'Installation Photo',
  CERTIFICATES = 'Certificates Zip',
}

export enum ChartType {
  LINE = 'line',
  STEPPED_LINE = 'stepped-line',
  // BAR = 'bar',
  STACKED_BAR = 'stacked-bar',
}

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


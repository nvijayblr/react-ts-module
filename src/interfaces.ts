import { Dictionary } from 'lodash';

import {
  FanType,
  LockType,
  ModeType,
  OnlineStatus,
  ScheduleProfilePermission,
  SiteFeatureType,
  SpaceType,
  SystemGroupType,
  SystemType,
  UtilityServiceTypes,
} from './core/apollo/__generated__/resourcesGlobalTypes';
import { SortingType } from './enums';
import { IAQScorePerSite } from './modules/iaq/gql/getIAQScorePerSite.resources.gql';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export type ISystemAlertInfo = {
  id: number;
  name: string;
  type: SystemType;
  groupType: SystemGroupType;
  onlineStatus: OnlineStatus;
  floor?: string | null;
};

export interface ISite {
  id: number;
  img?: string | null;
  squareFeet?: number | null;
  availableSystemByTypes?: SystemType[] | null;
  nameOrAddess: string;
  streetName: string;
  streetNumber?: string | null;
  regionWithState: string;
  nameWithCity: string;
  yearBuilt?: number | null;
  address: string;
  zipCode: string;
  regionId: number;
  alerts?: Dictionary<ISystemAlertInfo[]> | null;
  searchString: string;
  timezone: string;
  amountOfSystemsByGroupTypes: Record<SystemGroupType, number>;
  latitude: string;
  longitude: string;
  order: number;
  features: Record<SiteFeatureType, boolean>;
  utilityServiceTypes: UtilityServiceTypes[];
}

export type ISiteIAQScore = ISite & IAQScorePerSite & { disabled: boolean };

export interface ISchedulerListItem {
  id: number;
  name: string;
  siteId: number;
  appliedToSystems: number;
  order: number;
  permission: ScheduleProfilePermission;
}

export interface SortingConfiguration {
  propertyName: string;
  sortType: SortingType;
}

export type TimeRange = [Date, Date];

export type NumberRange = [number, number];

export interface PackagedSystemSettings {
  setpointMax: number;
  setpointMin: number;
  mode: ModeType;
  fan: FanType;
  occupiedSetpointCool: number;
  occupiedSetpointHeat: number;
  unoccupiedSetpointCool: number;
  unoccupiedSetpointHeat: number;
  space: SpaceType;
  setLock: LockType;
}

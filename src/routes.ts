import { SystemType } from './core/apollo/__generated__/resourcesGlobalTypes';

export enum Routes {
  Login = '/auth/login',
  ResetPassword = '/auth/reset-password',
  //
  Map = '/map',
  NotificationsPage = '/notifications',
  PrivacyPolicy = '/privacy-policy',
  TermsOfUse = '/terms-of-use',
  //
  SettingsProfile = '/settings/profile',
  //
  // IEQ = '/ieq',
  AQ = '/aq',
  AQDetails = '/aq/:siteId',
  //
  Integrations = '/integrations',
  //
  Utilities = '/utility',
  UtilityConedOruDetails = '/utility/coned-oru',
  UtilityConedOruScopeSelection = '/utility/coned-oru/scope-selection',
  UtilityAPICreate = '/utility/api/create',
  //
  DemandResponse = '/demand-response',
  //
  Benchmark = '/benchmark',
  BenchmarkDetails = '/benchmark/:siteId',
  //
  ElectricSubmeters = '/electric-submeters',
  ElectricSubmetersDetails = '/electric-submeters/:siteId',
  //
  Meter = '/meter',
  //
  Billing = '/billing',
  BillingDetails = '/billing/:siteId',
  //
  Systems = '/systems',
  PrvSystems = '/systems/prv',
  BoilersSystems = '/systems/boilers',
  ChargingStationSystems = '/systems/charging-station',
  PackagedSystems = '/systems/ahu',
  LightingSystems = '/systems/lighting',
  WeatherSystems = '/systems/weather',
  SmartOutletSystems = '/systems/outlet',
  SystemDetails = '/systems/:id',
  SystemGroupDetails = '/systems/groups/:id',
  //
  ScheduleProfiles = '/schedule-profiles',
  ScheduleProfilesDetails = '/schedule-profiles/:siteId',
  //
  SiteManagementOverview = '/site-management/',
  SiteManagementCreate = '/site-management/create',
  SiteManagementDetails = '/site-management/:siteId',
  //
  SiteManagementSpaceCreate = '/site-management/:siteId/spaces/create',
  SiteManagementSpaceDetails = '/site-management/:siteId/spaces/:spaceId',
  //
  SiteManagementLeaseCreate = '/site-management/:siteId/leases/create',
  SiteManagementLeaseDetails = '/site-management/:siteId/leases/:leaseId',
  //
  Admin = '/admin',
  AdminSite = '/admin/sites',
  AdminSiteCreate = '/admin/sites/create',
  AdminSitesEdit = '/admin/sites/:id',
  AdminDepartments = '/admin/departments',
  AdminUsers = '/admin/users',
  AdminUserCreate = '/admin/users/create',
  AdminUserEdit = '/admin/users/:id',
  //
  Devices = '/devices',
  DevicesGateways = '/devices/gateways',
  DevicesGatewaysCreate = '/devices/gateways/create',
  DevicesGatewaysEdit = '/devices/gateways/:id',
  DevicesSystems = '/devices/systems',
  DevicesSystemsCreate = '/devices/systems/create',
  DevicesSystemsEdit = '/devices/systems/:id',
  DevicesSensors = '/devices/sensors',
  DevicesSensorsCreate = '/devices/sensors/create',
  DevicesSensorsEdit = '/devices/sensors/:id',
  //
  Alerts = '/alerts',
  AlertsHistory = '/alerts/:siteId/history',
  UserSettings = '/user-settings',
}

export interface ISystemDetails {
  id: number;
  siteId: number;
  type: SystemType;
  systemGroupId: number | null;
}

/**
 * Used only in places where we need to build/resolve some custom link from the parameters
 */
export class RoutesResolver {
  static SystemDetails(id: number): string {
    return Routes.SystemDetails.replace(':id', id.toString());
  }

  static AdminUserEdit(id: string): string {
    return Routes.AdminUserEdit.replace(':id', id);
  }

  static IEQDetails(siteId: number): string {
    return Routes.AQDetails.replace(':siteId', String(siteId));
  }

  static SiteManagementDetails(siteId: number): string {
    return Routes.SiteManagementDetails.replace(':siteId', String(siteId));
  }

  static SiteManagementSpaceCreate(siteId: number): string {
    return Routes.SiteManagementSpaceCreate.replace(':siteId', String(siteId));
  }

  static SiteManagementSpaceDetails(siteId: number, spaceId: number): string {
    return Routes.SiteManagementSpaceDetails.replace(':siteId', String(siteId)).replace(':spaceId', String(spaceId));
  }

  static SiteManagementLeaseCreate(siteId: number): string {
    return Routes.SiteManagementLeaseCreate.replace(':siteId', String(siteId));
  }

  static SiteManagementLeases(siteId: number): string {
    return Routes.SiteManagementLeaseDetails.replace(':siteId', String(siteId)).replace('/:leaseId', '');
  }

  static SiteManagementLeaseDetails(siteId: number, leaseId: number): string {
    return Routes.SiteManagementLeaseDetails.replace(':siteId', String(siteId)).replace(':leaseId', String(leaseId));
  }

  static ScheduleProfileDetails(siteId: number): string {
    return Routes.ScheduleProfilesDetails.replace(':siteId', String(siteId));
  }

  static BenchmarkDetails(id: number): string {
    return Routes.BenchmarkDetails.replace(':siteId', id.toString());
  }

  static AdminSiteEdit(id: number): string {
    return Routes.AdminSitesEdit.replace(':id', id.toString());
  }

  static SystemGroupDetails(systemGroupId: number): string {
    return Routes.SystemGroupDetails.replace(':id', systemGroupId.toString());
  }

  static AdminSystemEdit(systemId: number | string): string {
    return Routes.DevicesSystemsEdit.replace(':id', systemId.toString());
  }

  static DeviceGatewayEdit(systemId: number | string): string {
    return Routes.DevicesGatewaysEdit.replace(':id', systemId.toString());
  }

  static AdminSensorEdit(sensorId: number | string): string {
    return Routes.DevicesSensorsEdit.replace(':id', sensorId.toString());
  }

  static BillingDetails(siteId: number, tabSlug?: string): string {
    return Routes.BillingDetails.replace(':siteId', String(siteId)) + (tabSlug || '');
  }

  static ElectricSubmeterDetails(siteId: number): string {
    return Routes.ElectricSubmetersDetails.replace(':siteId', String(siteId));
  }

  static getRouteToSystem({ type, id, siteId, systemGroupId }: ISystemDetails): string {
    switch (type) {
      case SystemType.TBL_TCI:
        return RoutesResolver.IEQDetails(siteId);
      case SystemType.ELECTRICITY_SUBMETER:
        return RoutesResolver.ElectricSubmeterDetails(siteId);
      case SystemType.LUTRON_VIVE_LIGHTING:
      case SystemType.SMART_OUTLET_T0006623:
        return systemGroupId ? RoutesResolver.SystemGroupDetails(systemGroupId) : '';
      case SystemType.HW_BOILER_HT_HWR:
      case SystemType.HW_BOILER_TEKMAR_284:
      case SystemType.PACKAGE_ALTC24PROG:
      case SystemType.PACKAGE_HONEYWELL_TC500AN:
      case SystemType.PACKAGE_ECOBEE_DEFAULT:
      case SystemType.STEAM_PRV_STATION:
      case SystemType.ST_BOILER_F_HT_MPC:
      case SystemType.WEATHER_STATION_WTS506:
      default:
        return RoutesResolver.SystemDetails(id);
    }
  }
}

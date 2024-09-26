export enum Routes {
  Login = '/auth/login',
  ResetPassword = '/auth/reset-password',
  //
  Map = '/map',
  NotificationsPage = '/notifications',
  PrivacyPolicy = '/privacy-policy',
  TermsOfUse = '/terms-of-use',
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
}

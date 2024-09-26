import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import withSuspense from './cdk/HOCs/withSuspense/withSuspence';
import GuestRoutesWrapper from './core/router/GuestRoutesWrapper';
import ProtectedRoutesWrapper from './core/router/ProtectedRoutesWrapper';
import { BenchmarkDetailsPageLazy, BenchmarksPageLazy } from './modules/benchmarks/public';
import { ElectricityDetailsPageLazy, ElectricitySitesPageLazy } from './modules/electricity/public';
import { IAQDetailsPageLazy, IAQScorePerSitesPageLazy } from './modules/iaq/public';
import { SitesSelectionPageSkeleton } from './modules/sites/pages/SiteSelectionPage/SitesSelectionPage.skeleton';
import { LazySiteManagementDetailsPage, LazySiteManagementOverviewPage } from './modules/sites/public';
import { LazySpaceDetailsPage } from './modules/spaces/public';
import { LazyLeaseDetailsPage } from './pages/site-management/[siteId]/leases/[leaseId]';
import { Routes as RoutePath } from './routes';
import LayoutCentered from './shared/containers/LayoutCentered/LayoutCentered';
import LayoutWithHeaderAndFixedContent from './shared/containers/LayoutWithHeaderAndFixedContent/LayoutWithHeaderAndFixedContent';
import LayoutForSites from './shared/containers/LayoutWithHeaderAndFooter/LayoutWithHeaderAndFooter';
import LayoutWithNavigation from './shared/containers/LayoutWithNavigation/LayoutWithNavigation';

const SiteSelectionPageLazy = withSuspense(
  lazy(() => import('./modules/sites/pages/SiteSelectionPage/SiteSelectionPage')),
  <SitesSelectionPageSkeleton />
);
const ProfilePageLazy = withSuspense(lazy(() => import('./modules/settings/pages/ProfilePage')));
const LoginPageLazy = withSuspense(lazy(() => import('./modules/auth/pages/LoginPage/LoginPage')));
const ResetPasswordPageLazy = withSuspense(
  lazy(() => import('./modules/auth/pages/ResetPasswordPage/ResetPasswordPage'))
);
const OperationsOverviewPageLazy = withSuspense(lazy(() => import('./modules/sites/pages/OperationsOverviewPage')));

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={RoutePath.Map} />} />

      <Route
        element={
          <GuestRoutesWrapper>
            <LayoutCentered />
          </GuestRoutesWrapper>
        }
      >
        <Route path={RoutePath.Login} Component={LoginPageLazy} />
        <Route path={RoutePath.ResetPassword} Component={ResetPasswordPageLazy} />
      </Route>

      <Route
        element={
          <ProtectedRoutesWrapper>
            <LayoutWithNavigation />
          </ProtectedRoutesWrapper>
        }
      >
        <Route path={RoutePath.SettingsProfile} Component={ProfilePageLazy} />

        <Route
          path={RoutePath.Map}
          Component={() => (
            <LayoutWithHeaderAndFixedContent>
              <SiteSelectionPageLazy />
            </LayoutWithHeaderAndFixedContent>
          )}
        />

        <Route element={<LayoutForSites />}>
          <Route path={RoutePath.Systems} Component={OperationsOverviewPageLazy} />
          <Route path={RoutePath.AQ} Component={IAQScorePerSitesPageLazy} />
          <Route path={RoutePath.AQDetails + '/*'} Component={IAQDetailsPageLazy} />
          <Route path={RoutePath.Benchmark} Component={BenchmarksPageLazy} />
          <Route path={RoutePath.BenchmarkDetails} Component={BenchmarkDetailsPageLazy} />
          <Route path={RoutePath.ElectricSubmeters} Component={ElectricitySitesPageLazy} />
          <Route path={RoutePath.ElectricSubmetersDetails + '/*'} Component={ElectricityDetailsPageLazy} />
          <Route path={RoutePath.SiteManagementOverview} Component={LazySiteManagementOverviewPage} />
          <Route path={RoutePath.SiteManagementSpaceCreate} Component={LazySpaceDetailsPage} />
          <Route path={RoutePath.SiteManagementSpaceDetails + '/*'} Component={LazySpaceDetailsPage} />
          <Route path={RoutePath.SiteManagementLeaseCreate} Component={LazyLeaseDetailsPage} />
          <Route path={RoutePath.SiteManagementLeaseDetails + '/*'} Component={LazyLeaseDetailsPage} />
          <Route path={RoutePath.SiteManagementCreate} Component={LazySiteManagementDetailsPage} />
          <Route path={RoutePath.SiteManagementDetails + '/*'} Component={LazySiteManagementDetailsPage} />
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default AppRouter;

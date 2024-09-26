import { RouteObject } from 'react-router-dom';

import App from './App';
import ProtectedRoutesWrapper from './core/router/ProtectedRoutesWrapper';
import ErrorPage from './modules/static/pages/ErrorPage/ErrorPage';
import { staticRoutes } from './modules/static/router';
import adminRouter from './pages/admin/router';
import adrRouter from './pages/adr/router';
import alertsRouter from './pages/alerts/router';
import billingRouter from './pages/billing/router';
import devicesRouter from './pages/devices/router';
import downloadRouter from './pages/download/router';
import integrationsRouter from './pages/integrations/router';
import meterRouter from './pages/meter/router';
import scheduleRouter from './pages/schedule/router';
import systemsRouter from './pages/systems/router';
import userSettingsRouter from './pages/user-settings/router';
import utilityRouter from './pages/utility/router';
import LayoutForSites from './shared/containers/LayoutWithHeaderAndFooter/LayoutWithHeaderAndFooter';
import LayoutWithNavigation from './shared/containers/LayoutWithNavigation/LayoutWithNavigation';

export const router: RouteObject[] = [
  {
    element: <App />,
    // Do not display error page on localhost
    errorElement: process.env.REACT_APP_SENTRY_ENV ? <ErrorPage /> : undefined,
    children: [
      // TODO: remove this route when all modules will be migrated to react router v6
      {
        path: '*',
        lazy: async () => {
          const Component = (await import('./AppRouter')).default;
          return { Component };
        },
      },
      ...staticRoutes,
      {
        // Do not allow access if user is not authenticated
        element: (
          <ProtectedRoutesWrapper>
            <LayoutWithNavigation />
          </ProtectedRoutesWrapper>
        ),
        children: [
          {
            // Do not allow access if user has no site selected
            element: <LayoutForSites />,
            children: [
              // All routers defined with usage of ReactRouter v6
              ...alertsRouter,
              ...billingRouter,
              ...adrRouter,
              ...utilityRouter,
              ...meterRouter,
              ...scheduleRouter,
              ...systemsRouter,
              ...integrationsRouter,
            ],
          },
          {
            // Do allow access if user has no site selected
            element: <LayoutForSites allowAccessWithoutSites />,
            children: [
              // All routers defined with usage of ReactRouter v6
              ...downloadRouter,
              ...userSettingsRouter,
              ...devicesRouter,
              ...adminRouter,
            ],
          },
        ],
      },
    ],
  },
];


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

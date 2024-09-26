import { RouteObject } from 'react-router-dom';

import asLazyPage from 'src/cdk/HOCs/asLazyPage';
import { SiteFeatureType } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import ExceptionHandler from 'src/fragments/ExceptionHandler/ExceptionHandler';
import NotFoundPage from 'src/fragments/NotFoundPage/NotFoundPage';
import OverviewPerSiteLayout from 'src/fragments/layouts/OverviewPerSiteLayout';
import Guard from 'src/fragments/layouts/guard/Guard';
import AdjustmentsTab from 'src/modules/billing/components/Adjustments/AdjustmentsTab';
import BillingTab from 'src/modules/billing/components/BillingTab/BillingTab';
import BillingDetailsFilters from 'src/modules/billing/pages/BillingDetailsPage';
import { Routes } from 'src/routes';

enum TabsEnum {
  TENANT_BILLS = 'Tenant Bills',
  ADJUSTMENTS = 'Adjustments',
}

const TabsNames = [TabsEnum.TENANT_BILLS, TabsEnum.ADJUSTMENTS];

const router: RouteObject[] = [
  {
    path: Routes.Billing,
    element: <Guard feature={SiteFeatureType.BILLING} />,
    children: [
      {
        index: true,
        lazy: asLazyPage(() => import('./page'), import('./skeleton')),
      },
      {
        path: ':siteId',
        element: <Guard feature={SiteFeatureType.BILLING} siteIdRouteParamName='siteId' />,
        children: [
          {
            path: '',
            element: (
              <BillingDetailsFilters>
                <OverviewPerSiteLayout title='Billing' tabsNames={TabsNames} />
              </BillingDetailsFilters>
            ),
            errorElement: <ExceptionHandler />,
            children: [
              // TODO: rework to lazy pages
              {
                path: 'tenant-bills',
                element: <BillingTab filterScope={TabsEnum.TENANT_BILLS} />,
              },
              {
                path: 'adjustments',
                element: <AdjustmentsTab filterScope={TabsEnum.TENANT_BILLS} />,
                // lazy: asLazyPage(
                //   () => import('./[:siteId]/connected-systems/page'),
                //   import('./[:siteId]/connected-systems/skeleton')
                // ),
              },
              {
                path: '*',
                element: <NotFoundPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default router;

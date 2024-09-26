import { format, subMonths } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import _ from 'lodash';
import React from 'react';

import withRedirectToSite from 'src/cdk/HOCs/withRedirectToSite';
import { moneyWithCommasFormat, numberWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { DATE_FORMAT, DEFAULT_TZ_FOR_TABLE_COLUMNS, UNIT } from 'src/constants';
import { SiteFeatureType } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import { useAppSelector } from 'src/core/store/hooks';
import OverviewAcrossSitesLayout from 'src/fragments/layouts/OverviewAcrossSitesLayout';
import { GetBillingBySite, sitesBillingOverview } from 'src/modules/billing/gql/getBillingBySite.resources.gql';
import { selectSiteIdsWithFeature } from 'src/modules/sites/sitesSlice';
import { RoutesResolver } from 'src/routes';
import PercentChangePill from 'src/shared/components/PercentChangePill/PercentChangePill';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

const columns: TableColumn<
  GetBillingBySite & {
    disabled?: boolean;
  }
>[] = [
  {
    title: '# of Leases ',
    propertyName: 'leaseCount',
    align: 'end',
    size: '0.5fr',
    render: (row) => (
      <div key={`billing-lease-count-${row.siteId}`}>
        {!row.disabled && <p>{numberWithCommasFormat(row.leaseCount)}</p>}
      </div>
    ),
  },
  {
    title: '# of Pending Adjustments',
    propertyName: 'pendingAdjustmentsCount',
    align: 'end',
    size: '0.5fr',
    render: (row) => (
      <div key={`billing-pending-adjustments-count-${row.siteId}`}>
        {!row.disabled && <p>{numberWithCommasFormat(row.pendingAdjustmentsCount)}</p>}
      </div>
    ),
  },
  {
    title: `${format(
      subMonths(utcToZonedTime(new Date(), DEFAULT_TZ_FOR_TABLE_COLUMNS), 2),
      DATE_FORMAT.MONTH_YEAR_FULL
    )} (${UNIT.DOLLARS})`,
    propertyName: 'totalTwoMonthAgo',
    align: 'end',
    size: '0.5fr',
    render: (row) => (
      <div key={`billing-two-months-ago-${row.siteId}`}>
        {!row.disabled && <p>{moneyWithCommasFormat(row.totalTwoMonthAgo)}</p>}
      </div>
    ),
  },
  {
    title: `${format(
      subMonths(utcToZonedTime(new Date(), DEFAULT_TZ_FOR_TABLE_COLUMNS), 1),
      DATE_FORMAT.MONTH_YEAR_FULL
    )} (${UNIT.DOLLARS})`,
    propertyName: 'totalOneMonthAgo',
    align: 'end',
    size: '0.5fr',
    render: (row) => (
      <div key={`billing-one-month-ago-${row.siteId}`} className='body-small d-flex align-items-center'>
        {!row.disabled && <p>{moneyWithCommasFormat(row.totalOneMonthAgo)}</p>}
        {!row.disabled && <PercentChangePill className='ml-12' value={row.percentToPreviousPeriod} />}
      </div>
    ),
  },
];

const BillingSitesPage: React.FC = () => {
  const sitesIds = useAppSelector(selectSiteIdsWithFeature(SiteFeatureType.BILLING), _.isEqual);

  const {
    isInitialLoading,
    isFailed,
    response: dataPerSite = {},
  } = useDataFetchOnMountWithDeps(
    () => sitesBillingOverview(sitesIds).then((data) => _.keyBy(data, 'siteId')),
    [sitesIds]
  );

  return (
    <OverviewAcrossSitesLayout
      isInitialLoading={isInitialLoading}
      isFailed={isFailed}
      title='Billing'
      subtitle='View energy costs across sites'
      dataColumns={columns}
      dataPerSite={dataPerSite}
    />
  );
};

export default withRedirectToSite(BillingSitesPage, RoutesResolver.BillingDetails);

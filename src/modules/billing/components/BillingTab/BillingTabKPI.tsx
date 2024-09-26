import { format } from 'date-fns';
import { isUndefined } from 'lodash';
import React, { useMemo, useState } from 'react';

import { moneyWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchOnMountWithDeps';
import { UTCStringToLocalDate } from 'src/cdk/utils/datetimeToDate';
import { DATE_FORMAT, UNIT } from 'src/constants';
import { InvoicesFilterInput } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import ElevatedBox from 'src/shared/components/ElevatedBox/ElevatedBox';
import { KPIWithComparison } from 'src/shared/components/KPIWithComparison/KPIWithComparison';
import { CircularLoader } from 'src/shared/components/Loader/Loader';
import { calcPreviousPeriodForMonthYear } from 'src/shared/utils/calcPreviousPeriod';

import { getInvoicesKPIForSite, InvoicesKPIForSite } from '../../gql/getInvoicesKPIForSite.resources.gql';

import styles from './BillingTab.module.scss';

interface BillingTabKPIProps {
  siteId: number;
  filters: InvoicesFilterInput;
}

const BillingTabKPI: React.FC<BillingTabKPIProps> = ({ siteId, filters }) => {
  const [invoicesKPI, setInvoicesKPIs] = useState<InvoicesKPIForSite>();

  const percentComparisonText = useMemo(() => {
    const { from, to, previousInterval } = filters;
    const [prevPeriodFrom, prevPeriodTo] = !isUndefined(previousInterval)
      ? [previousInterval!.from, previousInterval!.to]
      : calcPreviousPeriodForMonthYear(from, to);
    const start = format(UTCStringToLocalDate(prevPeriodFrom), DATE_FORMAT.MONTH_YEAR_SHORT);
    const end = format(UTCStringToLocalDate(prevPeriodTo), DATE_FORMAT.MONTH_YEAR_SHORT);
    return `Compared to ${start}${start === end ? '' : ` - ${end}`}`;
  }, [filters.from, filters.to, filters.previousInterval?.from, filters.previousInterval?.to]);

  const { isLoading, isFailed } = useFetchOnMountWithDeps(
    () =>
      getInvoicesKPIForSite(siteId, {
        tenantIds: filters.tenantIds,
        from: filters.from,
        to: filters.to,
        previousInterval: filters.previousInterval && {
          from: filters.previousInterval.from,
          to: filters.previousInterval.to,
        },
      }),
    setInvoicesKPIs,
    [siteId, filters.from, filters.to, filters.tenantIds, filters.previousInterval?.from, filters.previousInterval?.to]
  );

  if (isLoading) {
    return <CircularLoader />;
  }

  if (isFailed || !invoicesKPI) {
    return <ElevatedBox error>Failed to load Invoices KPIs</ElevatedBox>;
  }

  return (
    <div className={styles['header-tiles']}>
      <KPIWithComparison
        name='Total Bill Cost'
        value={invoicesKPI.total}
        format={moneyWithCommasFormat}
        unit={UNIT.DOLLARS}
        percentValue={invoicesKPI.totalPercentToPreviousPeriod}
        percentComparisonText={percentComparisonText}
      />
      <KPIWithComparison
        name='Total Energy Cost'
        value={invoicesKPI.energy}
        format={moneyWithCommasFormat}
        unit={UNIT.DOLLARS}
        percentValue={invoicesKPI.energyPercentToPreviousPeriod}
        percentComparisonText={percentComparisonText}
      />
      <KPIWithComparison
        name='Total Demand Cost'
        value={invoicesKPI.demand}
        format={moneyWithCommasFormat}
        unit={UNIT.DOLLARS}
        percentValue={invoicesKPI.demandPercentToPreviousPeriod}
        percentComparisonText={percentComparisonText}
      />
    </div>
  );
};

export default BillingTabKPI;

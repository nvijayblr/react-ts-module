import { format } from 'date-fns';
import _, { orderBy } from 'lodash';
import React, { useState } from 'react';

import { moneyWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchOnMountWithDeps';
import { useInPortal } from 'src/cdk/hooks/useInPortal';
import { useNumberParam } from 'src/cdk/hooks/useNumberParam';
import { mapDateToYearMonthStr } from 'src/cdk/utils/datetimeToDate';
import ClipboardText from 'src/components/ClipboardText/ClipboardText';
import { CountWithInfoTooltip } from 'src/components/CountWithInfoTooltip/CountWithInfoTooltip';
import { DATE_FORMAT, TAX_CHARGE_NAME, UNIT } from 'src/constants';
import { InvoicesFilterInput } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import { downloadFromServer } from 'src/core/service/downloadData';
import { FilterStorageKey, SortingType } from 'src/enums';
import { SortingConfiguration } from 'src/interfaces';
import api from 'src/logic/leases/gql';
import { Button } from 'src/shared/components/Button/Button';
import { Checkbox } from 'src/shared/components/Checkbox/Checkbox';
import {
  DatePickerRangeType,
  MonthPickerQuickRanges,
  buttonsConfig,
} from 'src/shared/components/DatePicker/DateRangePicker/config';
import { MonthRangePicker } from 'src/shared/components/DatePicker/MonthRangePicker/MonthRangePicker';
import ElevatedBox from 'src/shared/components/ElevatedBox/ElevatedBox';
import { CircularLoader } from 'src/shared/components/Loader/Loader';
import StickyBottomPopup from 'src/shared/components/Popup/StickyBottomPopup';
import Table from 'src/shared/components/Table/Table';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import { FilterButton } from '../../../filters/public/FilterButton';
import { FilterChips } from '../../../filters/public/FilterChipList';
import { useFilterValues } from '../../../filters/public/useFilterValues';
import TileHeader from '../../../systems/components/shared/TileHeader/TileHeader';
import { BillingFilterValues } from '../../billing.interface';
import { Invoice, InvoiceCharges, getInvoicesForSite } from '../../gql/getInvoicesForSite.resources.gql';

import BillingTabKPI from './BillingTabKPI';

type SelectableInvoice = Invoice & { selected?: boolean };

const columns: TableColumn<SelectableInvoice>[] = [
  {
    title: '',
    propertyName: 'checkbox',
    size: '16px',
    render: (row) => (
      <Checkbox
        selected={row.selected ?? false}
        onClick={() => {
          // Do nothing, selection is handled via `onRowClick`
        }}
      />
    ),
  },
  {
    title: 'Invoice #',
    propertyName: 'invoiceKey',
    sortable: true,
    size: '150px',
    render: (_, cellValue) => <ClipboardText color='primary'>{cellValue}</ClipboardText>,
  },
  {
    title: 'Tenant',
    propertyName: 'tenantName',
    sortable: true,
    render: (row, tenantName: string) => (
      <div key={`invoices-lease-${row.id}`}>
        <p>{tenantName}</p>
        <CountWithInfoTooltip items={row.spaces.map((i) => i.spaceName)} entity='space' displayValueIfSingle />
      </div>
    ),
  },
  {
    title: 'Billing Period',
    propertyName: 'endPeriod',
    size: 'minmax(190px, 1fr)',
    render: (row) => (
      <p key={`invoices-billing-period-${row.id}`}>
        {format(row.startPeriod, DATE_FORMAT.DATE_SHORT)} - {format(row.endPeriod, DATE_FORMAT.DATE_SHORT)}
      </p>
    ),
    sortable: true,
  },
  {
    title: 'Billing Month',
    propertyName: 'billingMonth',
    size: '110px',
    render: (row) => (
      <p key={`invoices-billing-month-${row.id}`}>{format(row.billingMonth, DATE_FORMAT.MONTH_YEAR_FULL)}</p>
    ),
    sortable: true,
  },
  {
    title: `Energy (${UNIT.DOLLARS})`,
    propertyName: 'totalUsageCost',
    align: 'end',
    sortable: true,
    render: (row, energyCost: number) => <p key={`invoice-energy-${row.id}`}>{moneyWithCommasFormat(energyCost)}</p>,
  },
  {
    title: `Demand (${UNIT.DOLLARS})`,
    propertyName: 'totalPeakDemandCost',
    align: 'end',
    sortable: true,
    render: (row, peakDemand: number) => <p key={`invoice-demand-${row.id}`}>{moneyWithCommasFormat(peakDemand)}</p>,
  },
  {
    title: `Charges (${UNIT.DOLLARS})`,
    propertyName: 'charges',
    align: 'end',
    sortable: true,
    render: (row, allCharges: InvoiceCharges[]) => {
      const charges = allCharges?.filter((i) => i.chargeName !== TAX_CHARGE_NAME) ?? [];
      return (
        <div key={`invoices-lease-${row.id}`}>
          <p className='text-right'>{moneyWithCommasFormat(_.sumBy(charges, 'chargeValue'))}</p>
          <CountWithInfoTooltip
            items={charges}
            entity='charge'
            iconPosition='left'
            tooltipItemRenderer={(charge) => {
              return (
                <div
                  key={`invoice-charge-${row.id}-${charge.chargeName}`}
                  className='d-flex flex-row justify-content-space-between gap-16'
                >
                  <p>{charge.chargeName}</p>
                  <p>{moneyWithCommasFormat(charge.chargeValue)}</p>
                </div>
              );
            }}
          />
        </div>
      );
    },
  },
  {
    title: `Tax (${UNIT.DOLLARS})`,
    propertyName: 'tax',
    align: 'end',
    sortable: true,
    render: (row) => {
      const taxes = row?.charges?.filter((i) => i.chargeName === TAX_CHARGE_NAME) ?? [];
      const value = _.sumBy(taxes, 'chargeValue');
      return (
        <div key={`invoices-tax-${row.id}`}>
          <p className='text-right'>{moneyWithCommasFormat(value)}</p>
        </div>
      );
    },
  },
  {
    title: `Total (${UNIT.DOLLARS})`,
    propertyName: 'totalAmount',
    align: 'end',
    sortable: true,
    render: (row, total: number) => <p key={`invoice-total-${row.id}`}>{moneyWithCommasFormat(total)}</p>,
  },
];

interface BillingTabProps {
  filterScope: string;
}

interface BillingTimeInterval {
  currentInterval: [Date, Date];
  previousInterval?: [Date, Date];
}

const BillingTab: React.FC<BillingTabProps> = ({ filterScope }) => {
  const siteId = useNumberParam('siteId', true);
  const filtersStorageKey = FilterStorageKey.SubmetersPerSite + siteId;
  const { filterValues } = useFilterValues<BillingFilterValues>({ storageKey: filtersStorageKey });
  const [invoices, setInvoices] = useState<SelectableInvoice[]>([]);
  const [timeRange, setTimeRange] = useState<BillingTimeInterval>(() => {
    return {
      currentInterval: buttonsConfig[DatePickerRangeType.LAST_MONTH]!.getTimeRange(),
      previousInterval: buttonsConfig[DatePickerRangeType.LAST_MONTH]!.getPrevTimeRange(),
    };
  });
  const [sortConfig, setSortConfig] = useState<SortingConfiguration>({
    propertyName: 'endPeriod',
    sortType: SortingType.Descending,
  });

  function updateSortConfig(sortConfig: SortingConfiguration) {
    if (sortConfig.propertyName === 'charges') {
      setInvoices(orderBy(invoices, (row) => _.sumBy(row.charges, 'chargeValue'), sortConfig.sortType));
    } else {
      setInvoices(orderBy(invoices, sortConfig.propertyName, sortConfig.sortType));
    }
    setSortConfig(sortConfig);
  }

  function handleInvoicesData(submetersDetails: SelectableInvoice[]) {
    setInvoices(orderBy(submetersDetails, sortConfig.propertyName, sortConfig.sortType));
  }

  const filters: InvoicesFilterInput = {
    from: mapDateToYearMonthStr(timeRange.currentInterval[0]),
    to: mapDateToYearMonthStr(timeRange.currentInterval[1]),
    tenantIds: filterValues.tenantIds,
    previousInterval: timeRange.previousInterval && {
      from: mapDateToYearMonthStr(timeRange.previousInterval[0]),
      to: mapDateToYearMonthStr(timeRange.previousInterval[1]),
    },
  };

  const { isLoading, isFailed } = useFetchOnMountWithDeps(
    () => {
      return getInvoicesForSite(siteId, {
        tenantIds: filterValues.tenantIds,
        from: mapDateToYearMonthStr(timeRange.currentInterval[0]),
        to: mapDateToYearMonthStr(timeRange.currentInterval[1]),
      });
    },
    handleInvoicesData,
    [filterValues.tenantIds, timeRange]
  );

  function toggleInvoiceSelection(id: number): void {
    setInvoices(
      invoices.map((invoice) => {
        if (invoice.id === id) {
          return {
            ...invoice,
            selected: !invoice.selected,
          };
        }
        return invoice;
      })
    );
  }

  function selectAll(): void {
    setInvoices(
      invoices.map((invoice) => {
        return {
          ...invoice,
          selected: true,
        };
      })
    );
  }

  function deselectAll(): void {
    setInvoices(
      invoices.map((invoice) => {
        return {
          ...invoice,
          selected: false,
        };
      })
    );
  }

  async function downloadSelectedInvoices() {
    const path = (await api.DownloadInvoices({ invoiceIds: selectedInvoiceIds })).downloadTenantInvoiceFiles;
    await downloadFromServer(path);
  }

  const selectedInvoiceIds = invoices.filter((invoice) => invoice.selected).map((i) => i.id);

  const leftPortal = useInPortal(
    <FilterChips storageKey={filtersStorageKey} scope={filterScope} />,
    'tabs-left-portal'
  );
  const rightPortal = useInPortal(
    <>
      <MonthRangePicker
        timeRange={timeRange.currentInterval}
        initTimerangeType={DatePickerRangeType.LAST_MONTH}
        buttonsToDisplay={MonthPickerQuickRanges}
        onClick={(currentInterval, previousInterval) => setTimeRange({ currentInterval, previousInterval })}
      />
      <FilterButton storageKey={filtersStorageKey} />
    </>,
    'tabs-right-portal'
  );

  if (isLoading) {
    return <CircularLoader />;
  }

  if (isFailed) {
    return <ElevatedBox error>Failed to load Invoices Details</ElevatedBox>;
  }

  function getTableSubtext() {
    const start = format(timeRange.currentInterval[0], DATE_FORMAT.MONTH_YEAR_FULL);
    const end = format(timeRange.currentInterval[1], DATE_FORMAT.MONTH_YEAR_FULL);
    if (start === end) {
      return start;
    }
    return `${start} - ${end}`;
  }

  return (
    <>
      {leftPortal}
      {rightPortal}
      <BillingTabKPI siteId={siteId} filters={filters} />
      <div className='card flat el-04 mt-24 p-24'>
        <TileHeader title='Bills' subtitle={getTableSubtext()} />
        <Table
          columns={columns}
          data={invoices}
          onRowClick={(row) => {
            toggleInvoiceSelection(row.id);
          }}
          sortConfig={sortConfig}
          updateSortConfig={updateSortConfig}
        />
      </div>
      <StickyBottomPopup
        selected={selectedInvoiceIds.length}
        total={invoices.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        entityName='Bills'
      >
        <Button onClick={downloadSelectedInvoices} variant='primary' label='Download' />
      </StickyBottomPopup>
    </>
  );
};

export default BillingTab;

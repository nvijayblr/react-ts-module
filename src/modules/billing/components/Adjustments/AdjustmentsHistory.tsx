import { format } from 'date-fns';
import _ from 'lodash';
import React, { useState } from 'react';

import { moneyWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchOnMountWithDeps';
import ClipboardText from 'src/components/ClipboardText/ClipboardText';
import { DATE_FORMAT, UNIT } from 'src/constants';
import { downloadFromServer } from 'src/core/service/downloadData';
import api from 'src/logic/leases/gql';
import { Button } from 'src/shared/components/Button/Button';
import { Checkbox } from 'src/shared/components/Checkbox/Checkbox';
import {
  buttonsConfig,
  DatePickerRangeType,
  MonthPickerQuickRanges,
} from 'src/shared/components/DatePicker/DateRangePicker/config';
import { MonthRangePicker } from 'src/shared/components/DatePicker/MonthRangePicker/MonthRangePicker';
import ElevatedBox from 'src/shared/components/ElevatedBox/ElevatedBox';
import { InfoTooltip } from 'src/shared/components/InfoTooltip/InfoTooltip';
import { CircularLoader } from 'src/shared/components/Loader/Loader';
import StickyBottomPopup from 'src/shared/components/Popup/StickyBottomPopup';
import Table from 'src/shared/components/Table/Table';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import { useFilterValues } from '../../../filters/public/useFilterValues';
import TileHeader from '../../../systems/components/shared/TileHeader/TileHeader';
import { BillingFilterValues } from '../../billing.interface';
import {
  getHistoricalAdjustmentsForSite,
  HistoricalAdjustment,
} from '../../gql/getHistoricalAdjustmentsForSite.resources.gql';

type SelectableHistoricalAdjustment = HistoricalAdjustment & { selected?: boolean };

const columns: TableColumn<SelectableHistoricalAdjustment>[] = [
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
    size: '150px',
    render: (_, cellValue) => <ClipboardText color='primary'>{cellValue.toString()}</ClipboardText>,
  },
  {
    title: 'Adjustment',
    propertyName: 'id',
    render: (row) => (
      <div key='id'>
        <p>{row.name}</p>
        {/* <p className='body-small color-secondary'>{row.id}</p> */}
      </div>
    ),
  },
  {
    title: 'Tenant',
    propertyName: 'tenantId',
    render: (row) => (
      <div key='tenant'>
        <p>{row.tenantName}</p>
        <p className='body-small color-secondary'>{row.leaseAccountNumber}</p>
      </div>
    ),
  },
  {
    title: 'Billing Period',
    propertyName: 'endPeriod',
    render: (row) => (
      <p key={`invoices-billing-period-${row.id}`}>
        {format(row.invoiceStartPeriod, DATE_FORMAT.DATE_SHORT)}&nbsp;-&nbsp;
        {format(row.invoiceEndPeriod, DATE_FORMAT.DATE_SHORT)}
      </p>
    ),
  },
  {
    title: 'Billing Month',
    propertyName: 'invoiceBillingMonth',
    render: (row) => (
      <p key={`invoices-billing-month-${row.id}`}>{format(row.invoiceBillingMonth, DATE_FORMAT.MONTH_YEAR_FULL)}</p>
    ),
  },
  {
    title: `Amount (${UNIT.DOLLARS})`,
    propertyName: 'amount',
    align: 'end',
    render: (row) => <p key='amount'>{moneyWithCommasFormat(row.chargeAmount)}</p>,
  },
  {
    title: '',
    propertyName: 'description',
    size: '20px',
    render: (row) => (
      <InfoTooltip key='description' disabled={_.isEmpty(row.description)}>
        <p className='color-secondary'>Description</p>
        <p>{row.description}</p>
      </InfoTooltip>
    ),
  },
];

interface Props {
  siteId: number;
  filtersStorageKey: string;
}

const AdjustmentsHistory: React.FC<Props> = ({ siteId, filtersStorageKey }) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>(
    buttonsConfig[DatePickerRangeType.LAST_12_MONTHS]!.getTimeRange()
  );
  const [adjustments, setAdjustments] = useState<SelectableHistoricalAdjustment[]>([]);

  const { filterValues } = useFilterValues<BillingFilterValues>({ storageKey: filtersStorageKey });

  const { isLoading, isFailed } = useFetchOnMountWithDeps(
    () => {
      return getHistoricalAdjustmentsForSite(siteId, filterValues.tenantIds, dateRange[0], dateRange[1]);
    },
    setAdjustments,
    [siteId, filterValues.tenantIds, dateRange]
  );

  function toggleAdjustmentSelection(id: number): void {
    setAdjustments(
      adjustments.map((item) => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  }

  function selectAll(): void {
    setAdjustments(
      adjustments.map((item) => {
        return { ...item, selected: true };
      })
    );
  }

  function deselectAll(): void {
    setAdjustments(
      adjustments.map((item) => {
        return { ...item, selected: false };
      })
    );
  }

  async function downloadSelectedInvoices() {
    const path = (await api.DownloadInvoices({ invoiceIds: selectedInvoiceIds })).downloadTenantInvoiceFiles;
    await downloadFromServer(path);
  }

  const selectedInvoiceIds = _.uniq(adjustments.filter((item) => item.selected).map((i) => i.invoiceId));

  if (isLoading) {
    return <CircularLoader />;
  }

  if (isFailed) {
    return <ElevatedBox error>Failed to load Adjustments History</ElevatedBox>;
  }

  return (
    <>
      <div className='card flat el-04 mt-24 p-24'>
        <TileHeader title='History'>
          <MonthRangePicker
            timeRange={dateRange}
            initTimerangeType={DatePickerRangeType.LAST_12_MONTHS}
            buttonsToDisplay={MonthPickerQuickRanges}
            onClick={(dateRange) => setDateRange(dateRange)}
          />
        </TileHeader>
        <Table
          columns={columns}
          data={adjustments}
          onRowClick={(row) => {
            toggleAdjustmentSelection(row.id);
          }}
        />
      </div>
      <StickyBottomPopup
        selected={selectedInvoiceIds.length}
        total={_.uniqBy(adjustments, 'invoiceKey').length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        entityName='Bills'
      >
        <Button onClick={downloadSelectedInvoices} variant='primary' label='Download' />
      </StickyBottomPopup>
    </>
  );
};

export default AdjustmentsHistory;

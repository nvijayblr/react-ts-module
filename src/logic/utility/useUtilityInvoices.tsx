import { format } from 'date-fns';
import _ from 'lodash';
import { useMemo, useState } from 'react';

import { moneyWithCommasFormat, numberWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { mapDateToYearMonthStr } from 'src/cdk/utils/datetimeToDate';
import { DATE_FORMAT, MAP_UTILITY_TYPE_TO_UNIT, N_A, UNIT } from 'src/constants';
import {
  UtilityInvoiceItemType,
  UtilityInvoiceStatus,
  UtilityServiceTypes,
} from 'src/core/apollo/__generated__/utilityGlobalTypes';
import { UTILITY_INVOICE_ITEM_TYPE, UTILITY_INVOICE_STATUS_LABEL } from 'src/core/enum-labels';
import { downloadFromServer } from 'src/core/service/downloadData';
import { toastService } from 'src/core/service/toastService';
import { useAppSelector } from 'src/core/store/hooks';
import api from 'src/logic/utility/gql';
import { UtilityInvoiceReviewModal } from 'src/materials/utility/UtilityInvoiceReviewModal/UtilityInvoiceReviewModal';
import { selectTimezoneForSiteId } from 'src/modules/sites/sitesSlice';
import { Button } from 'src/shared/components/Button/Button';
import { DatePickerRangeType, buttonsConfig } from 'src/shared/components/DatePicker/DateRangePicker/config';
import { Icon, SupportedIconColors } from 'src/shared/components/Icon/Icon';
import { SupportedIcon } from 'src/shared/components/Icon/gen/suported-icons';
import { InfoTooltip } from 'src/shared/components/InfoTooltip/InfoTooltip';
import { CustomTooltip } from 'src/shared/components/Popup';
import { OptionItem } from 'src/shared/components/Select';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import { useUtilityMetersContext } from './useUtilityMetersContext';

interface UtilityBill {
  id: number;
  startDate: string;
  endDate: string;
  billingMonth: string;
  statementDate: string;
  billingAccount: string;
  billingAddress: string;
  billingContact: string;
  totalVolume: string;
  totalCost: string;
  status: UtilityInvoiceStatus;
  files: string[];
  note?: string | null;
  hddDays?: number;
  cddDays?: number;
  siteTimezone: string;
  updatedAt: Date;
  updatedBy?: string;
  items: Record<UtilityInvoiceItemType, string>;
  downloadInvoice: () => Promise<void>;
  updateNoteWithStatus: (status: UtilityInvoiceStatus, note?: string) => Promise<void>;
}

export function useUtilityInvoices(siteId: number, utilityType: UtilityServiceTypes) {
  const timezone = useAppSelector(selectTimezoneForSiteId(siteId));
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['hddDays', 'cddDays']);

  const [dateRange, setDateRange] = useState(buttonsConfig[DatePickerRangeType.LAST_12_MONTHS]!.getTimeRange());
  const meters = useUtilityMetersContext();
  const filterValues = meters.filterValues;

  const {
    response: data = [],
    isLoading,
    refetch,
  } = useDataFetchOnMountWithDeps(
    () =>
      api
        .GetInvoices({
          siteId,
          type: utilityType,
          meterIds: filterValues.meterIds,
          datePeriod: {
            from: mapDateToYearMonthStr(dateRange[0]),
            to: mapDateToYearMonthStr(dateRange[1]),
          },
        })
        .then((res) =>
          res.getUtilityInvoices.map((i) => {
            const result: UtilityBill = {
              siteTimezone: timezone || 'UTC',
              id: i.id,
              startDate: format(i.startDate, DATE_FORMAT.DATE_SHORT),
              endDate: format(i.endDate, DATE_FORMAT.DATE_SHORT),
              billingMonth: format(i.billingMonth, DATE_FORMAT.MONTH_YEAR_SHORT),
              statementDate: i.statementDate ? format(i.statementDate, DATE_FORMAT.DATE_SHORT) : N_A,
              billingAccount: i.billingAccount,
              billingAddress: i.billingAddress,
              billingContact: i.billingContact ?? '',
              totalCost: moneyWithCommasFormat(i.totalCost),
              totalVolume: numberWithCommasFormat(i.totalVolume),
              status: i.status ?? UtilityInvoiceStatus.WAITING_FOR_REVIEW,
              note: i.notes,
              files: i.files || [],
              hddDays: i.hddDays ?? undefined,
              cddDays: i.cddDays ?? undefined,
              updatedAt: i.updated_at,
              updatedBy: i.updated_by ?? undefined,
              downloadInvoice: downloadInvoice.bind(null, i.id),
              updateNoteWithStatus: updateNoteWithStatus.bind(null, i.id),
              items: _.chain(i.invoiceItems)
                .keyBy('type')
                .mapValues((item) => moneyWithCommasFormat(item.cost))
                .value() as Record<UtilityInvoiceItemType, string>,
            };
            return result;
          })
        ),
    [filterValues.meterIds, siteId, utilityType, dateRange]
  );

  const columnsOptions: OptionItem<string, TableColumn<UtilityBill>>[] = useMemo(() => {
    const dynamicColumns = _.chain(data)
      .flatMap((d) => _.keys(d.items))
      .uniq()
      .map(
        (i) =>
          ({
            key: i,
            displayValue: UTILITY_INVOICE_ITEM_TYPE[i as UtilityInvoiceItemType],
            config: {
              title: UTILITY_INVOICE_ITEM_TYPE[i as UtilityInvoiceItemType],
              align: 'end',
              propertyName: 'items.' + i,
            },
          }) as OptionItem<UtilityInvoiceItemType, TableColumn<UtilityBill>>
      )
      .value();

    return [
      {
        key: 'hddDays',
        displayValue: 'HDD',
        config: {
          title: `HDD`,
          align: 'end',
          propertyName: 'hddDays',
          className: 'color-secondary',
        },
      },
      {
        key: 'cddDays',
        displayValue: 'CDD',
        config: {
          title: `CDD`,
          align: 'end',
          propertyName: 'cddDays',
          className: 'color-secondary',
        },
      },
      ...dynamicColumns,
    ];
  }, [data]);

  const columns = useMemo(
    () => buildColumns(MAP_UTILITY_TYPE_TO_UNIT[utilityType], selectedColumns, columnsOptions),
    [utilityType, selectedColumns, columnsOptions]
  );

  async function updateNoteWithStatus(invoiceId: number, status: UtilityInvoiceStatus, notes?: string) {
    await api.UpdateInvoice({
      utilityInvoiceId: invoiceId,
      info: {
        status,
        notes,
      },
    });
    toastService.success('Bill status successfully updated');
    refetch();
  }

  async function downloadInvoice(invoiceId: number) {
    const path = (await api.DownloadInvoice({ utilityInvoiceId: invoiceId })).downloadUtilityInvoiceFiles;
    await downloadFromServer(path);
  }

  return {
    filtersStorageKey: meters.filtersStorageKey,
    isLoading,
    columns,
    data,
    dateRange,
    setDateRange,
    dynamicColumns: {
      options: columnsOptions,
      value: selectedColumns,
      setValue: setSelectedColumns,
    },
  };
}

const INVOICE_ICON: Record<UtilityInvoiceStatus, { color: SupportedIconColors; icon: SupportedIcon }> = {
  [UtilityInvoiceStatus.WAITING_FOR_REVIEW]: { color: 'secondary', icon: 'refresh' },
  [UtilityInvoiceStatus.MANUALLY_PASSED_BY_USER]: { color: 'green', icon: 'check' },
  [UtilityInvoiceStatus.PASSED_ALL_AUDITS]: { color: 'green', icon: 'check' },
  [UtilityInvoiceStatus.FAILED_SOME_AUDITS]: { color: 'red', icon: 'close' },
  [UtilityInvoiceStatus.MANUALLY_REJECTED_BY_USER]: { color: 'red', icon: 'close' },
};

const commonStartingColumns: TableColumn<UtilityBill>[] = [
  {
    title: 'Period Start',
    size: '100px',
    propertyName: 'startDate',
  },
  {
    title: 'Period End',
    size: '100px',
    propertyName: 'endDate',
  },
  {
    title: 'Statement Date',
    size: '100px',
    propertyName: 'statementDate',
  },
  {
    title: 'Billing Month',
    size: '100px',
    propertyName: 'billingMonth',
  },
  {
    title: 'Billing Info',
    propertyName: 'billingAccount',
    size: '100px',
    render: (row) => (
      <div key='billingAccount' className='d-flex gap-4 align-items-center'>
        <p className='one-line-ellipsis'>{row.billingAccount}</p>
        <InfoTooltip>
          {row.billingAddress || N_A}
          <br />
          {row.billingContact || N_A}
        </InfoTooltip>
      </div>
    ),
  },
];

const commonEndingColumns: TableColumn<UtilityBill>[] = [
  {
    title: `Total Cost`,
    align: 'end',
    propertyName: 'totalCost',
  },
  {
    title: '',
    size: '80px',
    propertyName: 'actions',
    render: (row) => (
      <div key='actions' className='d-flex align-items-center justify-content-end gap-8'>
        {row.files.length > 0 && <Button variant='flat' size='small' icon='download' onClick={row.downloadInvoice} />}
        <CustomTooltip
          triggerComponent={
            <Icon color={INVOICE_ICON[row.status].color} icon={INVOICE_ICON[row.status].icon} size='s' />
          }
        >
          {UTILITY_INVOICE_STATUS_LABEL[row.status]}
        </CustomTooltip>
        <UtilityInvoiceReviewModal
          key='note'
          status={row.status}
          updatedAt={row.updatedAt}
          updatedBy={row.updatedBy}
          note={row.note ?? undefined}
          onSubmit={row.updateNoteWithStatus}
        />
      </div>
    ),
  },
];

function buildColumns(
  unit: UNIT,
  selectedColumns: string[],
  columnOptions: OptionItem<string, TableColumn<UtilityBill>>[]
): TableColumn<UtilityBill>[] {
  const dynamicColumns = columnOptions.filter((c) => selectedColumns.includes(c.key)).map((i) => i.config!);

  const columns: TableColumn<UtilityBill>[] = [
    ...commonStartingColumns,
    ...dynamicColumns,
    {
      title: `Total (${unit})`,
      align: 'end',
      propertyName: 'totalVolume',
    },
    ...commonEndingColumns,
  ];

  return columns;
}

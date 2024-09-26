import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import React, { useMemo, useState } from 'react';

import Ellipsis from 'src/atoms/Ellipsis/Ellipsis';
import { moneyWithCommasFormat } from 'src/cdk/formatter/numberFormatter';
import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { useInPortal } from 'src/cdk/hooks/useInPortal';
import { DATE_FORMAT, UNIT } from 'src/constants';
import Logger from 'src/core/service/logger';
import { useAppSelector } from 'src/core/store/hooks';
import DisplayUser from 'src/materials/users/DisplayUser/DisplayUser';
import { selectTimezoneForSiteId } from 'src/modules/sites/sitesSlice';
import { Button } from 'src/shared/components/Button/Button';
import ConfirmationMessageModal from 'src/shared/components/ConfirmationMessageModal/ConfirmationMessageModal';
import ElevatedBox from 'src/shared/components/ElevatedBox/ElevatedBox';
import Table from 'src/shared/components/Table/Table';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import { useFilterValues } from '../../../filters/public/useFilterValues';
import TileHeader from '../../../systems/components/shared/TileHeader/TileHeader';
import { BillingFilterValues } from '../../billing.interface';
import { deleteAdjustment } from '../../gql/deleteAdjustment.resources.gql';
import { PendingAdjustment, getPendingAdjustmentsForSite } from '../../gql/getPendingAdjustmentsForSite.resources.gql';

import AdjustmentDetailsModal from './AdjustmentDetailsModal';

const columns: TableColumn<PendingAdjustment & { delete: VoidFunction | undefined }>[] = [
  {
    title: 'Adjustment',
    propertyName: 'id',
    render: (row) => (
      <div key='id'>
        <p>{row.name}</p>
        <p className='body-small color-secondary'>{row.id}</p>
      </div>
    ),
  },
  {
    title: 'Lease',
    propertyName: 'tenantId',
    render: (row) => (
      <div key='lease'>
        <p>{row.tenantName}</p>
        <p className='body-small color-secondary'>{row.leaseId}</p>
      </div>
    ),
  },
  {
    title: `Description`,
    propertyName: 'description',
    render: (row, description) => <Ellipsis>{description}</Ellipsis>,
  },
  {
    title: 'Frequency',
    propertyName: 'nextInvoiceDate',
    render: (row) => (
      <div key='occurence'>
        <p>{row.occurenceLabel}</p>
        <p className='body-small color-secondary'>
          Upcoming bill: {format(row.nextInvoiceDate, DATE_FORMAT.DATE_SHORT)}
        </p>
      </div>
    ),
  },
  {
    title: `Amount per Bill (${UNIT.DOLLARS})`,
    propertyName: 'amountPerInvoice',
    align: 'end',
    render: (row) => <p key='amount'>{moneyWithCommasFormat(row.amountPerInvoice)}</p>,
  },
  {
    title: 'Updated',
    propertyName: 'updatedAt',
    render: (row) => (
      <div key='updatedAt'>
        <p>
          <DisplayUser userId={row.updatedBy} />
        </p>
        <p className='body-small color-secondary'>{format(row.updatedAt, DATE_FORMAT.DATE_SHORT)}</p>
      </div>
    ),
  },
  {
    size: '24px',
    title: '',
    propertyName: 'delete',
    render: (row) =>
      row.delete ? <Button key='delete' onClick={row.delete} icon='trash' variant='flat' size='small' /> : <></>,
  },
];

interface Props {
  siteId: number;
  filtersStorageKey: string;
}

const AdjustmentsQueue: React.FC<Props> = ({ siteId, filtersStorageKey }) => {
  const [adjustmentToDelete, setAdjustmentToDelete] = useState<number>();
  const [adjustmentModal, setAdjustmentModal] = useState<{ adjustmentId?: number }>();
  const { filterValues } = useFilterValues<BillingFilterValues>({ storageKey: filtersStorageKey });

  // TODO: move to reusable hook
  const siteTimeZone = useAppSelector(selectTimezoneForSiteId(siteId));
  const currentTimeOnSite = useMemo(
    () => utcToZonedTime(new Date().toISOString(), siteTimeZone || 'UTC'),
    [siteTimeZone]
  );

  const {
    isLoading,
    isFailed,
    response: adjustments = [],
    refetch,
  } = useDataFetchOnMountWithDeps(() => {
    return getPendingAdjustmentsForSite(siteId, currentTimeOnSite, filterValues.tenantIds).then((response) => {
      return response.map((adjustment) => ({
        ...adjustment,
        delete: () => setAdjustmentToDelete(adjustment.id),
      }));
    });
  }, [siteId, filterValues.tenantIds]);

  function handleDeleteAdjustment() {
    if (adjustmentToDelete) {
      deleteAdjustment(adjustmentToDelete)
        .then(() => {
          Logger.success('Adjustment deleted successfully');
          setAdjustmentToDelete(undefined);
          refetch();
        })
        .catch((e) => {
          console.error(e);
          Logger.error('Failed to delete adjustment');
          setAdjustmentToDelete(undefined);
        });
    }
  }

  const actionsPortal = useInPortal(
    <Button
      onClick={() => {
        setAdjustmentModal({ adjustmentId: undefined });
      }}
      variant='primary'
      label='Add Adjustment'
    />,
    'tabs-right-portal'
  );

  if (isLoading) {
    // Hide loader even if data is loading
    return <></>;
  }

  if (isFailed) {
    return <ElevatedBox error>Failed to load Pending Adjustments</ElevatedBox>;
  }

  return (
    <>
      {actionsPortal}
      {adjustments.length > 0 && (
        <div className='card flat el-04 mt-24 p-24'>
          <TileHeader title='Pending' />
          <Table
            columns={columns}
            data={adjustments}
            onRowClick={(row) => {
              setAdjustmentModal({ adjustmentId: row.id });
            }}
          />
        </div>
      )}
      <AdjustmentDetailsModal
        isOpen={!!adjustmentModal}
        siteId={siteId}
        adjustmentId={adjustmentModal?.adjustmentId}
        onCancel={() => setAdjustmentModal(undefined)}
        onAccept={() => {
          refetch();
          setAdjustmentModal(undefined);
        }}
      />
      <ConfirmationMessageModal
        isOpen={!!adjustmentToDelete}
        type='confirm'
        title='Are you sure you want to delete this adjustment?'
        actionButtonLabel='Yes'
        cancelButtonLabel='Cancel'
        onCancel={() => setAdjustmentToDelete(undefined)}
        onAccept={handleDeleteAdjustment}
      />
    </>
  );
};

export default AdjustmentsQueue;

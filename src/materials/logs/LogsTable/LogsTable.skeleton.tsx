import { useMemo } from 'react';

import { AuditLogResourceType } from 'src/core/apollo/__generated__/logsGlobalTypes';
import { AUDIT_LOG_RESOURCE_TYPE_LABEL } from 'src/core/enum-labels';
import TileHeader from 'src/modules/systems/components/shared/TileHeader/TileHeader';
import { SkeletonLoader } from 'src/shared/components/Loader/Loader';
import Table from 'src/shared/components/Table/Table';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import styles from './LogsTable.module.scss';

function buildColumns(withResource: boolean, resourceType: AuditLogResourceType): TableColumn<unknown>[] {
  return [
    {
      title: 'Date and Time',
      propertyName: 'date',
      size: '100px',
      render: () => (
        <div>
          <SkeletonLoader height='20' type='text-75' className='mb-2' />
          <SkeletonLoader height='18' type='text-50' />
        </div>
      ),
    },
    {
      title: 'Initiator',
      propertyName: 'initiator',
      render: () => <SkeletonLoader type='text-50' />,
    },
    ...(withResource
      ? [
          {
            title: AUDIT_LOG_RESOURCE_TYPE_LABEL[resourceType] ?? '',
            propertyName: 'resource_id',
            render: () => <SkeletonLoader type='text-50' />,
          },
        ]
      : []),
    {
      title: 'Type',
      propertyName: 'type',
      render: () => <SkeletonLoader type='text-50' />,
    },
    {
      title: 'Action',
      propertyName: 'action',
      size: '2fr',
      render: () => <SkeletonLoader type='text-50' />,
    },
    {
      title: 'Comments',
      propertyName: 'comments',
      size: '2fr',
      render: () => <SkeletonLoader type='text-25' />,
    },
  ];
}

export const LogsTableOnlySkeleton: React.FC<{ showResourceColumn: boolean; resourceType: AuditLogResourceType }> = (
  props
) => {
  const columns = useMemo(
    () => buildColumns(props.showResourceColumn, props.resourceType),
    [props.showResourceColumn, props.resourceType]
  );

  return <Table columns={columns} data={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} />;
};

const LogsSkeleton: React.FC = () => {
  return (
    <section className='card el-04 p-24'>
      <TileHeader title=''>
        <div className={styles['header-filters']}>
          <SkeletonLoader height='36px' width='160px' />
          <SkeletonLoader height='36px' width='160px' />
          <SkeletonLoader height='36px' width='112px' />
        </div>
      </TileHeader>
      <LogsTableOnlySkeleton showResourceColumn={false} resourceType={'' as AuditLogResourceType} />
    </section>
  );
};

export default LogsSkeleton;

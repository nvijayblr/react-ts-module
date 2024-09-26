import _ from 'lodash';
import React, { useMemo } from 'react';

import ClipboardText from 'src/components/ClipboardText/ClipboardText';
import { N_A } from 'src/constants';
import { AuditLogResourceType } from 'src/core/apollo/__generated__/logsGlobalTypes';
import { AUDIT_LOG_RESOURCE_TYPE_LABEL } from 'src/core/enum-labels';
import datetimeColumn from 'src/fragments/table-columns/datetimeColumn';
import { LogEntry, useLogs } from 'src/logic/logs/useLogs';
import TileHeader from 'src/modules/systems/components/shared/TileHeader/TileHeader';
import { Button } from 'src/shared/components/Button/Button';
import ElevatedBox from 'src/shared/components/ElevatedBox/ElevatedBox';
import LoadMorePagination from 'src/shared/components/LoadMore/LoadMorePagination';
import { MultiSelect, OptionItem, Select } from 'src/shared/components/Select';
import Table from 'src/shared/components/Table/Table';
import TableColumnInput from 'src/shared/components/TableColumnInput/TableColumnInput';
import { TableColumn } from 'src/shared/components/TableHeader/TableHeader';

import LogActivityModal from '../LogActivityModal/LogActivityModal';

import styles from './LogsTable.module.scss';
import { LogsTableOnlySkeleton } from './LogsTable.skeleton';

function buildColumns(resources: OptionItem<string>[], resourceType: AuditLogResourceType): TableColumn<LogEntry>[] {
  const resourceColumns: TableColumn<LogEntry>[] =
    resources.length > 1
      ? [
          {
            title: AUDIT_LOG_RESOURCE_TYPE_LABEL[resourceType],
            propertyName: 'resource_id',
            render: (row, cellValue: string) => {
              const resource = resources.find((resource) => resource.key === cellValue);
              return <ClipboardText>{resource ? resource.displayValue : N_A}</ClipboardText>;
            },
          },
        ]
      : [];

  return [
    {
      ...datetimeColumn,
      title: 'Date and Time',
      size: '100px',
      propertyName: 'datetime',
    },
    {
      title: 'Initiator',
      propertyName: 'initiator',
    },
    ...resourceColumns,
    {
      title: 'Type',
      propertyName: 'type',
    },
    {
      title: 'Action',
      propertyName: 'action',
      size: '2fr',
      className: 'break-word break-white-space',
    },
    {
      title: 'Comments',
      propertyName: 'comments',
      size: '2fr',
      render: (row, cellValue: string) => (
        <TableColumnInput
          onSubmit={(value) => row.onEditFieldSubmit(value, row)}
          editAllowed={row.isFieldEditable}
          editFieldMaxLength={250}
          value={cellValue}
          placeholder='Click to add comment'
        />
      ),
    },
  ];
}

interface Props {
  relatedSiteId: number | undefined;
  resources: OptionItem<string>[];
  resourceType: AuditLogResourceType;
  children?: React.ReactNode;
}

const LogsTable: React.FC<Props> = ({ relatedSiteId, resources, resourceType, children }) => {
  const resourceIds = useMemo(() => resources.map((resource) => resource.key), [resources]);
  const columns = useMemo(() => buildColumns(resources, resourceType), [resources, resourceType]);
  const { isInitialLoading, isLoading, isFailed, addNoteModal, data, filter, loadMore, total } = useLogs(
    relatedSiteId,
    resourceIds,
    resourceType
  );
  const showSkeleton = isInitialLoading || _.isEmpty(resources);

  if (isFailed) {
    return <ElevatedBox error>Failed to load logged activity</ElevatedBox>;
  }

  return (
    <section className='card el-04 p-24'>
      <TileHeader title=''>
        <div className={styles['header-filters']}>
          {children}
          <Select
            value={filter.value.typeFilter}
            options={filter.typeOptions}
            labelPosition='inside'
            label='Type'
            onClick={filter.setType}
          />
          <MultiSelect
            value={filter.value.usersFilter}
            options={filter.userOptions}
            labelPosition='inside'
            label='User'
            onClick={filter.setUser}
          />
          <div>
            <Button label='Add Activity' shape='rect' type='button' variant='primary' onClick={addNoteModal.show} />
          </div>
        </div>
      </TileHeader>
      {showSkeleton ? (
        <LogsTableOnlySkeleton showResourceColumn={resources.length > 1} resourceType={resourceType} />
      ) : (
        <Table columns={columns} data={data} emptyTableMessage='No logs were found' />
      )}
      <LoadMorePagination
        isLoading={isLoading}
        totalItems={total}
        loadedItems={data.length}
        entityName='Logs'
        onLoadMore={loadMore}
      />
      <LogActivityModal
        resources={resources}
        isOpen={addNoteModal.isOpen}
        title='Add Activity'
        subtitleText=''
        resourceType={resourceType}
        acceptAction={addNoteModal.onSubmit}
        cancelAction={addNoteModal.hide}
        activityLabel='Note'
      />
    </section>
  );
};

export default LogsTable;

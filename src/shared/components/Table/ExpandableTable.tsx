import _ from 'lodash';
import React from 'react';

import Accordeon from 'src/shared/containers/Accordeon/Accordeon';

import TableHeader, { TableColumn } from '../TableHeader/TableHeader';

import Table, { TableProps, TableRowColumns, useTableGridTemplateColumns } from './Table';

export interface ExpandableTableProps<T, C> {
  data: T[];
  parentKey: keyof T;
  parentColumns: TableColumn<T>[];
  parentRowClassName: TableProps<T>['rowClassName'];
  /**
   * Should be a key of T which contains array of C
   */
  childKey: keyof T;
  childColumns: TableColumn<C>[];
  childRowClassName?: TableProps<C>['rowClassName'];
  /**
   * Onclick function for whole row
   */
  onChildRowClick?: (row: C, index: number) => void;
}

function ExpandableTable<T, C>(props: ExpandableTableProps<T, C>): React.ReactElement {
  const gridTemplateColumns = useTableGridTemplateColumns(props.parentColumns);

  return (
    <>
      <TableHeader columns={props.parentColumns} gridTemplateColumns={gridTemplateColumns} />
      <Accordeon initialId={_.get(props.data, '0.' + props.parentKey.toString())?.toString()}>
        {props.data.map((row, index) => (
          <Accordeon.Item
            key={_.get(row, props.parentKey)?.toString()}
            id={_.get(row, props.parentKey)?.toString()}
            headerLeftInfoComponent={() => (
              <div
                className={props.parentRowClassName}
                style={{
                  gap: '32px',
                  alignItems: 'center',
                  display: 'grid',
                  gridTemplateColumns,
                }}
              >
                <TableRowColumns disabled={false} index={index} row={row} columns={props.parentColumns} />
              </div>
            )}
            withArrow={true}
          >
            <section className='card el-04 py-24 mb-24'>
              <Table
                columns={props.childColumns}
                data={_.get(row, props.childKey, []) as C[]}
                onRowClick={props.onChildRowClick}
                isStriped={true}
                rowClassName={props.childRowClassName}
              />
            </section>
          </Accordeon.Item>
        ))}
      </Accordeon>
    </>
  );
}

// Note: this implementation is better, but currently it is expected that "expandable table" should act, look and feel as an "accordeon"
/**
      {leftData.length > 0 && (
        <Table
          columns={leftColumns}
          data={leftData}
          onRowClick={onRowClick}
          disableRow={props.disableRow}
          isStriped={false}
          rowClassName={props.rowClassName}
        />
      )}

      {expandedRow !== null && (
        <section className='card el-04 py-24 mb-24'>
          <Table
            columns={childColumns}
            data={childData}
            onRowClick={props.onChildRowClick}
            isStriped={true}
            rowClassName={props.childRowClassName}
          />
        </section>
      )}

      {rightData.length > 0 && (
        <Table
          columns={rightColumns}
          data={rightData}
          onRowClick={onRowClick}
          disableRow={props.disableRow}
          isStriped={false}
          rowClassName={props.rowClassName}
        />
      )}
 */

export default ExpandableTable;

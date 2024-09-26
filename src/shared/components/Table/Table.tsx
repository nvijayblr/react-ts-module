import classNames from 'classnames';
import _ from 'lodash';
import React, { useMemo } from 'react';

import { N_A } from 'src/constants';
import { SortingConfiguration } from 'src/interfaces';

import ElevatedBox from '../ElevatedBox/ElevatedBox';
import TableHeader, { TableColumn } from '../TableHeader/TableHeader';

import styles from './Table.module.scss';

export interface TableProps<T> {
  /**
   * @see TableColumn documentation to find how table cells and columns can be
   * customized
   */
  columns: TableColumn<T>[];
  /**
   * Represents array of items to be rendered in that table
   */
  data: T[];
  /**
   * Can be use to change row height, default height 36px
   */
  rowMinHeight?: string;
  /**
   * Specify if the table content should be centered
   */
  center?: boolean;
  /**
   * Specify how much pixels the header space should be from the content
   */
  headerSpacing?: number;
  /**
   * @default "center"
   */
  alignItems?: 'center' | 'end' | 'start';
  headerClassName?: string;
  rowClassName?: string;
  /**
   * Onclick function for whole row
   */
  onRowClick?: (row: T, index: number) => void;
  /**
   * Disables row from highlighting / clicking / selection
   */
  disableRow?: (row: T, index: number) => boolean;
  /**
   * Highlights even rows
   * @default true
   */
  isStriped?: boolean;
  emptyTableMessage?: string;
  sortConfig?: SortingConfiguration;
  updateSortConfig?: (config: SortingConfiguration) => void;
}

/**
 * If there is no column which contains `size` property - then default css grid column config will be
 * `grid-template-columns: minmax(232px, 1.5fr) repeat(auto-fit, minmax(70px, 1fr));`
 *
 * If at least one column contains `size` property - all others will have `1fr` as default value
 */
function Table<T>(props: TableProps<T>): React.ReactElement {
  const gridTemplateColumns = useTableGridTemplateColumns(props.columns);

  const isStriped = props.isStriped ?? true;

  if (_.isEmpty(props.data)) {
    return <ElevatedBox title={props.emptyTableMessage} />;
  }

  return (
    <>
      <TableHeader
        columns={props.columns}
        sortConfig={props.sortConfig}
        updateSortConfig={props.updateSortConfig}
        gridTemplateColumns={gridTemplateColumns}
        center={props.center}
        bottomSpace={props.headerSpacing}
        className={props.headerClassName}
      />
      {props.data.map((row, i) => {
        const disabled = props.disableRow?.(row, i) ?? false;
        return (
          <div
            key={i.toString()}
            className={classNames(
              styles['table-row'],
              {
                'card flat el-step': isStriped ? i % 2 === 0 : true,
                'mb-16': !isStriped,
                [styles['clickable-row']]: _.get(row as unknown, '_non-clickable', false) ? false : !!props.onRowClick,
                [styles['disabled-row']]: disabled,
              },
              props.center && styles['center'],
              props.rowClassName
            )}
            onClick={(e) => {
              e.preventDefault();
              props.onRowClick && props.onRowClick(row, i);
            }}
            style={{
              gridTemplateColumns,
              minHeight: props.rowMinHeight,
              alignItems: props.alignItems ?? 'center',
              justifyItems: props.center ? 'center' : undefined,
            }}
          >
            <TableRowColumns disabled={disabled} index={i} row={row} columns={props.columns} />
          </div>
        );
      })}
    </>
  );
}

export function useTableGridTemplateColumns<T>(columns: TableColumn<T>[]): string {
  const gridTemplateColumns = useMemo(() => {
    return columns.map((i) => (i.size ? i.size : '1fr')).join(' ');
  }, [columns]);

  return gridTemplateColumns;
}

export function TableRowColumns<T>(props: {
  disabled: boolean;
  index: number;
  row: T;
  columns: TableProps<T>['columns'];
}): React.ReactElement {
  return (
    <>
      {props.columns.map((col) => (
        <div
          key={col.propertyName}
          className={classNames(styles['cell-wrap'], {
            [styles['column-center']]: col.align === 'center',
            [styles['column-end']]: col.align === 'end',
          })}
        >
          {col.render ? (
            col.hideIfDisabledRow && props.disabled ? null : (
              col.render(props.row, _.get(props.row, col.propertyName, undefined), props.index, props.disabled)
            )
          ) : (
            <p className={col.className}>
              {col.hideIfDisabledRow && props.disabled ? null : _.get(props.row, col.propertyName) ?? N_A}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

export default Table;

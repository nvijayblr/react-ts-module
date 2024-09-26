import _ from 'lodash';
import { useMemo } from 'react';

import { SkeletonLoader } from '../Loader/Loader';

import Table, { TableProps } from './Table';

interface Props<T> extends Omit<TableProps<T>, 'data'> {
  rows: number;
}

const DEFAULT_SKELETON_RENDERER = <SkeletonLoader type='text-50' />;

export function TableSkeleton<T>({ rows = 5, columns, ...props }: Props<T>) {
  const columnsOverride = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      render: () => column.skeleton ?? DEFAULT_SKELETON_RENDERER,
    }));
  }, [columns]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyData = useMemo(() => _.range(0, rows) as any as T[], [rows]);

  return <Table {...props} data={dummyData} columns={columnsOverride} />;
}

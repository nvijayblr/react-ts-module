import { lazy } from 'react';

import withSuspense from 'src/cdk/HOCs/withSuspense/withSuspence';

import LogsSkeleton from './LogsTable/LogsTable.skeleton';

const LazyLogsTable = withSuspense(
  lazy(() => import('./LogsTable/LogsTable')),
  <LogsSkeleton />
);

export const LogsTable = LazyLogsTable;

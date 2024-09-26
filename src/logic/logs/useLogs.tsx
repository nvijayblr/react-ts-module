import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { atf } from 'src/cdk/formatter/relativeTimeFormat';
import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { useInfiniteScroll } from 'src/cdk/hooks/useInfiniteScroll';
import { mapPairsAsOptions } from 'src/cdk/mappers/mapAsOptions';
import { N_A } from 'src/constants';
import { AuditLogResourceType, AuditLogType } from 'src/core/apollo/__generated__/logsGlobalTypes';
import { LOG_TYPE_LABEL } from 'src/core/enum-labels';
import { SYSTEM_LOG_TYPE_OPTIONS } from 'src/core/enum-options';
import Logger from 'src/core/service/logger';
import { selectUserId } from 'src/core/store/global/globalSlice';
import { useAppSelector } from 'src/core/store/hooks';
import api from 'src/logic/logs/gql';
import { selectTimezoneForSiteId } from 'src/modules/sites/sitesSlice';
import { OptionItem } from 'src/shared/components/Select';

import { useUserDisplay } from '../options/useUserDisplay';

import { GetResourceLogsQuery } from './gql/__generated__/index.logs.generated';

export type LogsItem = GetResourceLogsQuery['resourceAuditLogs']['data'][0];

export interface LogEntry {
  initial: LogsItem;
  siteTimezone: string;
  id: number;
  datetime: Date;
  date: string;
  resource_id: string;
  initiator: string;
  initiator_id: string;
  type: string;
  action: string;
  comments: string | null;
  comment_id: number | null;
  isFieldEditable: boolean;
  onEditFieldSubmit: (text: string, row: LogEntry) => void;
}

const typeFilterOptions: OptionItem<AuditLogType | undefined>[] = [
  { key: undefined, displayValue: 'All' },
  ...SYSTEM_LOG_TYPE_OPTIONS,
];

const OPTIONS_BY_RESOURCE_TYPE: Record<AuditLogResourceType, OptionItem<AuditLogType | undefined>[]> = {
  [AuditLogResourceType.SYSTEM]: typeFilterOptions,
  [AuditLogResourceType.USER]: typeFilterOptions.filter((i) =>
    [undefined, AuditLogType.EMAIL_NOTIFICATION, AuditLogType.SMS_NOTIFICATION, AuditLogType.NOTE].includes(i.key)
  ),
};

const DEFAULT_USER_OPTIONS: OptionItem<string[]>[] = [
  { key: [], displayValue: 'All' },
  { key: ['PLATFORM'], displayValue: 'Platform' },
];

interface FetchLogsState {
  usersFilter: string[];
  typeFilter?: AuditLogType;
}

const DEFAULT_FILTER: FetchLogsState = {
  usersFilter: DEFAULT_USER_OPTIONS[0].key,
  typeFilter: undefined,
};

export function useLogs(relatedSiteId: number | undefined, resourceIds: string[], resourceType: AuditLogResourceType) {
  const location = useLocation();
  const [isInitialLoading, setInitialLoading] = useState(true);
  const [filter, setFilter] = useState<FetchLogsState>(DEFAULT_FILTER);
  const [isAddNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const currentUserId = useSelector(selectUserId);
  const userDisplay = useUserDisplay();

  const siteTimezone = useAppSelector(selectTimezoneForSiteId(relatedSiteId)) ?? 'UTC';

  const { response: userFilterResponse = [] } = useDataFetchOnMountWithDeps(() => {
    if (resourceIds.length === 0) return Promise.resolve([]);
    return api.GetSystemUsersForFilter({ resourceIds, resourceType }).then((result) => result.systemUsersForFilter);
  }, [resourceIds, resourceType]);

  const userFilterOptions = useMemo(() => {
    return [
      ...DEFAULT_USER_OPTIONS,
      ...mapPairsAsOptions(_.toPairs(_.groupBy(userFilterResponse, userDisplay)).map(([key, value]) => [value, key])),
    ];
  }, [userFilterResponse, userDisplay]);

  const {
    data: responseItems,
    isInitialLoading: isInitialDataLoading,
    isLoading,
    isFailed,
    loadMoreData,
    updateItem,
    refetch,
    total,
  } = useInfiniteScroll(
    'LogsTable',
    location.pathname,
    (page: number, count: number) =>
      resourceIds.length === 0
        ? Promise.resolve({
            data: [],
            pagination: { currentPage: 1, perPage: 1, total: 0 },
          })
        : api
            .GetResourceLogs({
              resourceType,
              resourceIds,
              logsFilterInput: {
                perPageCount: count,
                currentPage: page,
                type: filter.typeFilter,
                userFilterIds: filter.usersFilter,
              },
            })
            .then((result) => ({
              data: result.resourceAuditLogs.data,
              pagination: result.resourceAuditLogs.pagination,
            })),
    [resourceIds, filter.typeFilter, filter.usersFilter]
  );

  const data: LogEntry[] = useMemo(() => {
    return responseItems.map((log) => {
      const user = userDisplay(log.initiator_id);
      return {
        initial: log,
        siteTimezone,
        resource_id: log.resourceId,
        id: log.id,
        datetime: log.createdAt,
        date: atf(log.createdAt, true),
        initiator: user === N_A ? log.initiator : user,
        initiator_id: log.initiator_id,
        type: LOG_TYPE_LABEL[log.type],
        action: log.actions,
        comments: log.comment ?? null,
        comment_id: log.comment_id ?? null,
        isFieldEditable: log.initiator_id === currentUserId,
        onEditFieldSubmit,
      };
    });
  }, [responseItems, userDisplay, siteTimezone, currentUserId]);

  // TODO: review implementation & find better solution
  // This is a workaround to prevent "flash of empty content" when there is no data, because Resource IDs are not ready yet
  useEffect(() => {
    if (isInitialLoading && isLoading && resourceIds.length > 0) {
      setInitialLoading(false);
    }
  }, [isInitialLoading, isLoading, resourceIds]);

  async function onEditFieldSubmit(text: string, displayRow: LogEntry): Promise<void> {
    const row = displayRow.initial;
    try {
      const result = await api.AddComment({
        auditLogId: row.id,
        comment: text,
        commentId: row.comment_id || null,
      });
      if (!result?.addComment) {
        throw new Error('Failed to add comment');
      }
      updateItem(row.id, {
        ...row,
        comment: result.addComment.comment,
        comment_id: result.addComment.id,
      });
    } catch (err: unknown) {
      console.error(err);
      Logger.error(`Failed to ${!row.comment_id ? 'add' : 'update'} comment`);
    }
  }

  async function onSubmitNewNote(resourceId: string, note: string) {
    try {
      await api.AddNoteLog({ resourceId, resourceType, note });
      Logger.success('Activity log added');
      setAddNoteModalOpen(false);
      refetch();
    } catch (err) {
      Logger.error('Failed to add note', err);
    }
  }

  return {
    isInitialLoading: isInitialDataLoading || isInitialLoading,
    isLoading,
    isFailed,
    addNoteModal: {
      isOpen: isAddNoteModalOpen,
      show: () => setAddNoteModalOpen(true),
      hide: () => setAddNoteModalOpen(false),
      onSubmit: onSubmitNewNote,
    },
    data,
    filter: {
      value: filter,
      userOptions: userFilterOptions,
      typeOptions: OPTIONS_BY_RESOURCE_TYPE[resourceType],
      setType: (typeFilter?: AuditLogType) => setFilter((p) => ({ ...p, typeFilter })),
      setUser: (userFilter: string[]) => setFilter((p) => ({ ...p, usersFilter: userFilter })),
      setPage: (page: number) => setFilter((p) => ({ ...p, page })),
      setItems: (recordsCount: number) => setFilter((p) => ({ ...p, recordsCount })),
    },
    total: total,
    loadMore: loadMoreData,
  };
}

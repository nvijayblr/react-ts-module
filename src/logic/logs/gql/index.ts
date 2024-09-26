import { connectSdk, logsAPI } from 'src/core/apollo/api';

import {
  AddCommentMutation,
  GetResourceLogsQuery,
  GetSystemUsersForFilterQuery,
  getSdk,
} from './__generated__/index.logs.generated';

export type AuditLogComment = AddCommentMutation['addComment'];
export type Pagination = GetResourceLogsQuery['resourceAuditLogs']['pagination'];
export type PaginatedAuditLogs = GetResourceLogsQuery['resourceAuditLogs'];
export type AuditLogs = PaginatedAuditLogs['data'];
export type UserFilter = GetSystemUsersForFilterQuery['systemUsersForFilter'][0];

const api = {
  ...connectSdk(logsAPI, getSdk),
};

export default api;

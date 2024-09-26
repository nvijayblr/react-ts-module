import type * as Types from '../../../../core/apollo/__generated__/logsGlobalTypes';

import type { GraphQLClient, RequestOptions } from 'graphql-request';
import { gql } from '@apollo/client';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type GetResourceLogsQueryVariables = Types.Exact<{
  logsFilterInput: Types.LogsFilterInput;
  resourceIds: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  resourceType: Types.AuditLogResourceType;
}>;

export type GetResourceLogsQuery = {
  resourceAuditLogs: {
    data: Array<{
      id: number;
      createdAt: Date;
      initiator: string;
      initiator_id: string;
      type: Types.AuditLogType;
      actions: string;
      comment?: string | null;
      comment_id?: number | null;
      resourceId: string;
      organizationId?: number | null;
      alertId?: number | null;
    }>;
    pagination: { currentPage: number; perPage: number; from: number; to: number; total: number; lastPage: number };
  };
};

export type AddNoteLogMutationVariables = Types.Exact<{
  resourceId: Types.Scalars['String']['input'];
  resourceType: Types.AuditLogResourceType;
  note: Types.Scalars['String']['input'];
}>;

export type AddNoteLogMutation = { addNoteLog: boolean };

export type AddCommentMutationVariables = Types.Exact<{
  auditLogId: Types.Scalars['Int']['input'];
  commentId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  comment: Types.Scalars['String']['input'];
}>;

export type AddCommentMutation = { addComment: { id: number; comment: string } };

export type GetSystemUsersForFilterQueryVariables = Types.Exact<{
  resourceIds: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  resourceType: Types.AuditLogResourceType;
}>;

export type GetSystemUsersForFilterQuery = { systemUsersForFilter: Array<string> };

export const GetResourceLogsDocument = gql`
  query GetResourceLogs(
    $logsFilterInput: LogsFilterInput!
    $resourceIds: [String!]!
    $resourceType: AuditLogResourceType!
  ) {
    resourceAuditLogs(logsFilterInput: $logsFilterInput, resourceIds: $resourceIds, resourceType: $resourceType) {
      data {
        id
        createdAt
        initiator
        initiator_id
        type
        actions
        comment
        comment_id
        resourceId
        organizationId
        alertId
      }
      pagination {
        currentPage
        perPage
        from
        to
        total
        lastPage
      }
    }
  }
`;
export const AddNoteLogDocument = gql`
  mutation AddNoteLog($resourceId: String!, $resourceType: AuditLogResourceType!, $note: String!) {
    addNoteLog(resourceId: $resourceId, resourceType: $resourceType, note: $note)
  }
`;
export const AddCommentDocument = gql`
  mutation AddComment($auditLogId: Int!, $commentId: Int, $comment: String!) {
    addComment(auditLogId: $auditLogId, commentId: $commentId, comment: $comment) {
      id
      comment
    }
  }
`;
export const GetSystemUsersForFilterDocument = gql`
  query GetSystemUsersForFilter($resourceIds: [String!]!, $resourceType: AuditLogResourceType!) {
    systemUsersForFilter(resourceIds: $resourceIds, resourceType: $resourceType)
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetResourceLogs(
      variables: GetResourceLogsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetResourceLogsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetResourceLogsQuery>(GetResourceLogsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetResourceLogs',
        'query',
        variables
      );
    },
    AddNoteLog(
      variables: AddNoteLogMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<AddNoteLogMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddNoteLogMutation>(AddNoteLogDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'AddNoteLog',
        'mutation',
        variables
      );
    },
    AddComment(
      variables: AddCommentMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<AddCommentMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddCommentMutation>(AddCommentDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'AddComment',
        'mutation',
        variables
      );
    },
    GetSystemUsersForFilter(
      variables: GetSystemUsersForFilterQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetSystemUsersForFilterQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSystemUsersForFilterQuery>(GetSystemUsersForFilterDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetSystemUsersForFilter',
        'query',
        variables
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;

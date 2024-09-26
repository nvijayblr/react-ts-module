import { gql } from '@apollo/client';

import { resourcesAPI } from 'src/core/apollo/api';

import { GetBillingBySiteQuery, GetBillingBySiteQueryVariables } from './__generated__/getBillingBySite.resources.gql';

export type GetBillingBySite = GetBillingBySiteQuery['sitesBillingOverview'][0];

const GET_BILLING_BY_SITE = gql`
  query GetBillingBySite($siteIds: [Int!]!) {
    sitesBillingOverview(siteIds: $siteIds) {
      siteId
      leaseCount
      pendingAdjustmentsCount
      totalTwoMonthAgo
      totalOneMonthAgo
      percentToPreviousPeriod
    }
  }
`;

export async function sitesBillingOverview(siteIds: number[]): Promise<GetBillingBySite[]> {
  const result = await resourcesAPI.query<GetBillingBySiteQuery, GetBillingBySiteQueryVariables>({
    query: GET_BILLING_BY_SITE,
    variables: {
      siteIds,
    },
  });

  return result.data.sitesBillingOverview;
}

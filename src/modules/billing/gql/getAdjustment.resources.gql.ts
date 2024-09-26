import { gql } from '@apollo/client';
import _ from 'lodash';

import { resourcesAPI } from 'src/core/apollo/api';

import { GetAdjustmentQuery, GetAdjustmentQueryVariables } from './__generated__/getAdjustment.resources.gql';

export type Adjustment = GetAdjustmentQuery['getAdditionalChargesForSite'][0];

const GET_ADJUSTMENT = gql`
  query GetAdjustment($siteId: Int!, $chargesIds: [Int!]) {
    getAdditionalChargesForSite(siteId: $siteId, chargesIds: $chargesIds) {
      id
      leaseId
      startDate
      endDate
      name
      chargeCalculationType
      value
      order
      description
      updatedAt
      updatedBy
      isAdjustment
    }
  }
`;

export async function getAdjustment(siteId: number, adjustmentId: number): Promise<Adjustment | undefined> {
  const result = await resourcesAPI.query<GetAdjustmentQuery, GetAdjustmentQueryVariables>({
    query: GET_ADJUSTMENT,
    variables: {
      siteId,
      chargesIds: [adjustmentId],
    },
  });

  const resultItem = _.head(result.data.getAdditionalChargesForSite);
  if (!resultItem) {
    return undefined;
  }
  return {
    ...resultItem,
    startDate: new Date(resultItem.startDate),
    endDate: resultItem.endDate ? new Date(resultItem.endDate) : null,
  };
}

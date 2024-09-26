import { gql } from '@apollo/client';

import { mapDateToDateStr } from 'src/cdk/utils/datetimeToDate';
import { resourcesAPI } from 'src/core/apollo/api';

import {
  UpdateAdjustmentMutation,
  UpdateAdjustmentMutationVariables,
} from './__generated__/updateAdjustment.resources.gql';
import { Adjustment } from './getAdjustment.resources.gql';

const UPDATE_ADJUSTMENT = gql`
  mutation UpdateAdjustment(
    $siteId: Int!
    $chargeId: Int!
    $updateAdditionalChargeInput: UpdateAdditionalChargeInput!
  ) {
    updateAdditionalCharge(
      siteId: $siteId
      chargeId: $chargeId
      updateAdditionalChargeInput: $updateAdditionalChargeInput
    )
  }
`;

export async function updateAdjustment(siteId: number, adjustment: Adjustment): Promise<boolean> {
  const result = await resourcesAPI.mutate<UpdateAdjustmentMutation, UpdateAdjustmentMutationVariables>({
    mutation: UPDATE_ADJUSTMENT,
    variables: {
      siteId,
      chargeId: adjustment.id,
      updateAdditionalChargeInput: {
        description: adjustment.description,
        name: adjustment.name,
        endDate: mapDateToDateStr(adjustment.endDate),
      },
    },
  });

  return result.data?.updateAdditionalCharge || false;
}

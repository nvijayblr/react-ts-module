import { gql } from '@apollo/client';

import { resourcesAPI } from 'src/core/apollo/api';

import {
  DeleteAdjustmentMutation,
  DeleteAdjustmentMutationVariables,
} from './__generated__/deleteAdjustment.resources.gql';

const CREATE_ADJUSTMENT = gql`
  mutation DeleteAdjustment($chargeId: Int!) {
    deleteAdditionalCharge(chargeId: $chargeId)
  }
`;

export async function deleteAdjustment(chargeId: number): Promise<boolean> {
  const result = await resourcesAPI.mutate<DeleteAdjustmentMutation, DeleteAdjustmentMutationVariables>({
    mutation: CREATE_ADJUSTMENT,
    variables: {
      chargeId,
    },
  });

  return result.data?.deleteAdditionalCharge || false;
}

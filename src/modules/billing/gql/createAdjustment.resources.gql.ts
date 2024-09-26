import { gql } from '@apollo/client';

import { mapDateToDateStr } from 'src/cdk/utils/datetimeToDate';
import { ChargeType } from 'src/core/apollo/__generated__/resourcesGlobalTypes';
import { resourcesAPI } from 'src/core/apollo/api';

import {
  CreateAdjustmentMutation,
  CreateAdjustmentMutationVariables,
} from './__generated__/createAdjustment.resources.gql';
import { Adjustment } from './getAdjustment.resources.gql';

const CREATE_ADJUSTMENT = gql`
  mutation CreateAdjustment($createAdditionalChargeInput: CreateAdditionalChargeInput!) {
    createAdditionalCharge(createAdditionalChargeInput: $createAdditionalChargeInput) {
      id
    }
  }
`;

export async function createAdjustment(adjustment: Adjustment): Promise<number | undefined> {
  const result = await resourcesAPI.mutate<CreateAdjustmentMutation, CreateAdjustmentMutationVariables>({
    mutation: CREATE_ADJUSTMENT,
    variables: {
      createAdditionalChargeInput: {
        chargeCalculationType: adjustment.chargeCalculationType,
        type: ChargeType.ADJUSTMENT,
        description: adjustment.description,
        name: adjustment.name,
        value: adjustment.value,
        isAdjustment: true,
        leaseId: adjustment.leaseId,
        order: adjustment.order,
        startDate: mapDateToDateStr(adjustment.startDate),
        endDate: mapDateToDateStr(adjustment.endDate),
      },
    },
  });

  return result.data?.createAdditionalCharge.id;
}

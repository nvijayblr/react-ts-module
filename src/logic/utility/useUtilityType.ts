import _ from 'lodash';
import { useParams } from 'react-router';

import { UtilityServiceTypes } from 'src/core/apollo/__generated__/utilityGlobalTypes';

const possibleUtilityTypes = _.values(UtilityServiceTypes) as UtilityServiceTypes[];

export function useUtilityType(): UtilityServiceTypes {
  const utilityType = useParams<{ type: string }>().type?.toUpperCase() as UtilityServiceTypes;
  if (!utilityType || !possibleUtilityTypes.includes(utilityType)) {
    throw new Error('Utility service type is not valid');
  }
  return utilityType;
}

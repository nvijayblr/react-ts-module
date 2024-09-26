import _ from 'lodash';
import { useState } from 'react';

import { useDataFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchDataOnMountWithDeps';
import { useAppSelector } from 'src/core/store/hooks';
import { selectedSitesIds } from 'src/modules/sites/sitesSlice';

import api from './gql';

export function useUtilityIntegrationsOverview() {
  const siteIds = useAppSelector(selectedSitesIds);
  const [searchString, setSearchString] = useState('');

  const {
    isInitialLoading,
    isFailed,
    response: integrations = [],
  } = useDataFetchOnMountWithDeps(() => {
    return Promise.all([api.UtilityIntegrations(), api.GetSystemIntegrations()]).then(([utility, system]) => {
      return _.orderBy([...utility.utilityIntegrations, ...system.systemIntegrations], 'name');
    });
  }, [siteIds]);

  if (isFailed) {
    throw new Error('Failed to fetch integrations');
  }

  return {
    isInitialLoading,
    integrations: integrations.filter((item) => item.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0),
    setSearchString,
  };
}

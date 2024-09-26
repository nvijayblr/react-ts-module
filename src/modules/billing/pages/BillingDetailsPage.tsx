import { useFetchOnMountWithDeps } from 'src/cdk/hooks/useFetchOnMountWithDeps';
import { useNumberParam } from 'src/cdk/hooks/useNumberParam';
import { useAppDispatch } from 'src/core/store/hooks';

import { resetFilterFields, setFilterFields } from '../../filters/filtersSlice';
import { getTenantsOptionsForSite } from '../gql/getTenantsOptionsForSite.resources.gql';

const BillingDetailsFilters: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const siteId = useNumberParam('siteId', true);

  useFetchOnMountWithDeps(
    () => {
      dispatch(resetFilterFields());
      return Promise.all([getTenantsOptionsForSite(siteId)]);
    },
    ([tenantOptions]) => {
      dispatch(
        setFilterFields([
          {
            label: 'Tenants',
            name: 'tenantIds',
            options: tenantOptions,
            type: 'multiselect',
          },
        ])
      );
    },
    [siteId]
  );

  return <>{children}</>;
};

export default BillingDetailsFilters;

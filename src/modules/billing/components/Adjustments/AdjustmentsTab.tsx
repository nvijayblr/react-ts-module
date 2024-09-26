import { useInPortal } from 'src/cdk/hooks/useInPortal';
import { useNumberParam } from 'src/cdk/hooks/useNumberParam';
import { FilterStorageKey } from 'src/enums';

import { FilterButton } from '../../../filters/public/FilterButton';
import { FilterChips } from '../../../filters/public/FilterChipList';

import AdjustmentsHistory from './AdjustmentsHistory';
import AdjustmentsQueue from './AdjustmentsQueue';

interface AdjustmentsTabProps {
  filterScope: string;
}

const AdjustmentsTab: React.FC<AdjustmentsTabProps> = ({ filterScope }) => {
  const siteId = useNumberParam('siteId', true);
  const filtersStorageKey = FilterStorageKey.SubmetersPerSite + siteId;

  return (
    <>
      {useInPortal(<FilterChips storageKey={filtersStorageKey} scope={filterScope} />, 'tabs-left-portal')}
      {useInPortal(<FilterButton storageKey={filtersStorageKey} />, 'tabs-right-portal')}
      <AdjustmentsQueue siteId={siteId} filtersStorageKey={filtersStorageKey} />
      <AdjustmentsHistory siteId={siteId} filtersStorageKey={filtersStorageKey} />
    </>
  );
};

export default AdjustmentsTab;

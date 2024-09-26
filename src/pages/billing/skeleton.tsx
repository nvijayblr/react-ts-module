import { SkeletonLoader } from 'src/shared/components/Loader/Loader';
import { PageHeaderWithActionsSkeletonLoader } from 'src/shared/containers/PageHeaderWithActions/PageHeaderWithActions.skeleton';

const BillingPageSkeleton: React.FC = () => {
  return (
    <PageHeaderWithActionsSkeletonLoader subtitle>
      <SkeletonLoader width='136px' height='38px' />
    </PageHeaderWithActionsSkeletonLoader>
  );
};

export default BillingPageSkeleton;

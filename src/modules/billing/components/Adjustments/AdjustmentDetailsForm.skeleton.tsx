import { SkeletonLoader } from 'src/shared/components/Loader/Loader';

export const AdjustmentDetailsFormSkeleton: React.FC = () => {
  return (
    <div className='d-flex flex-col gap-8'>
      <SkeletonLoader type='text-25' />
      <SkeletonLoader height='38px' />
      <div />
      <SkeletonLoader type='text-25' />
      <SkeletonLoader height='38px' />
      <div />
      <SkeletonLoader type='text-25' />
      <SkeletonLoader height='48px' />
      <div />
      <div className='d-flex flex-row gap-8'>
        <div style={{ flex: '2 1 0%' }}>
          <SkeletonLoader type='text-50' className='mb-8' />
          <SkeletonLoader height='32px' width='56px' />
        </div>
        <div style={{ flex: '1 1 0%' }}>
          <SkeletonLoader type='text-50' className='mb-8' />
          <SkeletonLoader height='32px' />
        </div>
      </div>
      <div />
      <SkeletonLoader type='text-25' />
      <SkeletonLoader height='38px' />
    </div>
  );
};

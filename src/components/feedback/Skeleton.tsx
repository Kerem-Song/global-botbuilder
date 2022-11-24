import { FC } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export interface ISkeletonProps {
  rows?: number;
}
export const Skeleton: FC<ISkeletonProps> = ({ rows = 3 }) => {
  return (
    <>
      <ReactLoadingSkeleton
        width="38%"
        height={16}
        baseColor="rgba(0,0,0,0.06)"
        style={{ lineHeight: 2 }}
      />
      <ReactLoadingSkeleton
        count={rows - 1}
        height={16}
        baseColor="rgba(0,0,0,0.06)"
        style={{ lineHeight: 2 }}
      />
      <ReactLoadingSkeleton width="61%" height={16} baseColor="rgba(0,0,0,0.06)" />
    </>
  );
};

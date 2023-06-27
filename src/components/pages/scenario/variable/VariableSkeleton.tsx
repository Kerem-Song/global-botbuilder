import { util } from '@modules/util';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const VariableSkeleton = () => {
  return (
    <div className="variableSkeletonList">
      <ReactLoadingSkeleton
        count={1}
        height={16}
        width={`${util.random(100)}%`}
        baseColor="rgba(0,0,0,0.06)"
        style={{ lineHeight: 2 }}
      />
      <ReactLoadingSkeleton
        count={1}
        height={16}
        baseColor="rgba(0,0,0,0.06)"
        style={{ lineHeight: 2 }}
      />
    </div>
  );
};

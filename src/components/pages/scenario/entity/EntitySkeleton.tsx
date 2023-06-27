import { Col } from '@components';
import { util } from '@modules/util';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const EntitySkeleton = () => {
  return (
    <Col span={6}>
      <div className="entityCard" role="presentation">
        <ReactLoadingSkeleton
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
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
          width={`${util.random(100)}%`}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
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
          width={`${util.random(100)}%`}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
        <ReactLoadingSkeleton
          count={1}
          height={16}
          width={`${util.random(100)}%`}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
      </div>
    </Col>
  );
};

import { Col } from '@components';
import { util } from '@modules/util';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const EntitySkeleton = () => {
  return (
    <Col span={6}>
      <div className="entityCard entityCardSkeleton" role="presentation">
        <div className="cardHeader">
          <div className="cardHeader">
            <span className="title">
              <ReactLoadingSkeleton
                width="80%"
                count={1}
                height={16}
                baseColor="rgba(0,0,0,0.06)"
                style={{ lineHeight: 2 }}
              />
            </span>
          </div>
        </div>
        <ReactLoadingSkeleton
          width={`${util.random(100)}%`}
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
        <ReactLoadingSkeleton
          width={`${util.random(100)}%`}
          count={1}
          height={16}
          baseColor="rgba(0,0,0,0.06)"
          style={{ lineHeight: 2 }}
        />
      </div>
    </Col>
  );
};

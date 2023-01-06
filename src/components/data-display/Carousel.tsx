import {
  icCarouselNextActive,
  icCarouselNextInactive,
  icCarouselPrevActive,
  icCarouselPrevInactive,
} from '@assets';
import { Col, Row } from '@components/layout';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { FC, ReactNode, useEffect, useState } from 'react';
export interface CarouselProps {
  children: ReactNode[];
  nodeId: string;
}

export const Carousel: FC<CarouselProps> = ({ nodeId, children }) => {
  const [current, setCurrent] = useState(0);

  const [style, setStyle] = useState({
    marginLeft: `${current * -190}px`,
    transition: 'none',
  });

  const { updateLine } = useUpdateLines();

  useEffect(() => {
    setStyle({ marginLeft: `${current * -190}px`, transition: 'all 0.3s ease-out' });
    updateLine(nodeId);
  }, [current]);

  const handleNextClick = () => {
    setCurrent(current === children.length - 1 ? 0 : current + 1);
  };

  const handlePrevClick = () => {
    setCurrent(current !== 0 ? current - 1 : 0);
  };

  return (
    <>
      {children.length > 1 && (
        <Row justify="space-between" align="center" className="carouselBtnWrapper">
          <Col>
            <button
              className="carouselBtn prev"
              onClick={handlePrevClick}
              disabled={current === 0}
            >
              <img
                src={current === 0 ? icCarouselPrevInactive : icCarouselPrevActive}
                alt="carouselPrevBtn"
              />
            </button>
          </Col>
          <Col>
            <p className="page">
              {current + 1}/{children.length}
            </p>
          </Col>
          <Col>
            <button
              className="carouselBtn next"
              onClick={handleNextClick}
              disabled={current + 1 === children.length}
            >
              <img
                src={
                  current + 1 === children.length
                    ? icCarouselNextInactive
                    : icCarouselNextActive
                }
                alt="carouselNextBtn"
              />
            </button>
          </Col>
        </Row>
      )}
      <div role="presentation" style={{ width: '190px', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', ...style }}>
          {children.map((c, i) => {
            return (
              <div style={{ width: '190px', flex: 'none' }} key={`card-wrap-${i}`}>
                {i === current ? c : <div style={{ width: '190px' }}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

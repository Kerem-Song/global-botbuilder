import {
  icCarouselNextActive,
  icCarouselNextInactive,
  icCarouselPrevActive,
  icCarouselPrevInactive,
} from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setCarouselIndex } from '@store/botbuilderSlice';
import { t } from 'i18next';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
export interface CarouselProps {
  children: ReactNode[];
  nodeId: string;
  addCarousel?: () => void;
}

export const Carousel: FC<CarouselProps> = ({ nodeId, children, addCarousel }) => {
  const [current, setCurrent] = useState(0);

  const [style, setStyle] = useState({
    marginLeft: `${current * -190}px`,
    transition: 'none',
  });

  const { t } = usePage();
  const { updateLine } = useUpdateLines();

  const length = children.length + (addCarousel ? 1 : 0);
  const dispatch = useDispatch();
  const storeCarouselIndex = useRootState(
    (state) => state.botBuilderReducer.carouselIndex,
  );
  const result = { ...storeCarouselIndex };
  const storeIndex = result[nodeId];
  const isHistoryViewer = useHistoryViewerMatch();

  useEffect(() => {
    if (!storeIndex) {
      setCurrent(0);
    } else {
      setCurrent(storeIndex);
    }
  }, [storeCarouselIndex]);

  useEffect(() => {
    setStyle({ marginLeft: `${current * -190}px`, transition: 'all 0.3s ease-out' });
    updateLine(nodeId);
    dispatch(setCarouselIndex({ id: nodeId, index: current }));
  }, [current]);

  const NextDisabled = () => {
    if (current + 1 > Math.min(current + 1, length - 1, 9)) {
      return true;
    }

    if (isHistoryViewer && current >= Math.min(current + 1, children.length - 1, 9)) {
      return true;
    }

    return false;
  };

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (NextDisabled()) {
      return;
    }
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const handlePrevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(current !== 0 ? current - 1 : 0);
  };

  return (
    <>
      {addCarousel && (
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
              {current >= children.length
                ? undefined
                : `${current + 1}/${children.length}`}
            </p>
          </Col>
          <Col>
            <button
              className="carouselBtn next"
              onClick={handleNextClick}
              disabled={NextDisabled()}
            >
              <img
                src={NextDisabled() ? icCarouselNextInactive : icCarouselNextActive}
                alt="carouselNextBtn"
              />
            </button>
          </Col>
        </Row>
      )}
      <div
        role="presentation"
        style={{
          width: '190px',
          overflowX: 'hidden',
          border: '1px solid #DCDCDC',
          borderRadius: '12px',
        }}
        className="carouselComponent"
      >
        <div style={{ display: 'flex', overflow: 'hidden', ...style }}>
          {children.map((c, i) => {
            return (
              <div
                style={{ width: '190px', flex: 'none', padding: '12px' }}
                key={`card-wrap-${i}`}
              >
                {i === current
                  ? c
                  : !isHistoryViewer && <div style={{ width: '190px' }}></div>}
              </div>
            );
          })}
          {!isHistoryViewer && (
            <div style={{ width: '166px', flex: 'none' }} tabIndex={-1}>
              <div style={{ width: '190px' }} tabIndex={-1}>
                <Button
                  block
                  onClick={addCarousel}
                  style={{ border: 'none' }}
                  tabIndex={-1}
                >
                  {t(`ADD_CAHTBUBBLE_BTN`)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

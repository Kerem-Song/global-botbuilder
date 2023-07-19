import {
  icAdd,
  icAddDisable,
  icCarouselNextActive,
  icCarouselNextInactive,
  icCarouselPrevActive,
  icCarouselPrevInactive,
  icDelete,
  icDeleteDisable,
} from '@assets';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { CONDITIONS_LIMIT, NODE_PREFIX } from '@modules';
import { setCarouselIndex } from '@store/botbuilderSlice';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface SwitchNodeCarouselProps {
  children: ReactNode[];
  conditionsId: string;
  addCarousel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteCarousel?: (e: number) => void;
}

export const SwitchNodeCarousel: FC<SwitchNodeCarouselProps> = ({
  conditionsId,
  children,
  addCarousel,
  deleteCarousel,
}) => {
  const switchWidth = 350;
  const [current, setCurrent] = useState(0);

  const [style, setStyle] = useState({
    marginLeft: `${current * -switchWidth}px`,
    transition: 'none',
  });

  const { t } = usePage();

  const length = children.length;
  const dispatch = useDispatch();
  const storeCarouselIndex = useRootState(
    (state) => state.botBuilderReducer.carouselIndex,
  );
  const result = { ...storeCarouselIndex };
  const storeIndex = result[conditionsId];
  const isHistoryViewer = useHistoryViewerMatch();

  useEffect(() => {
    if (!storeIndex) {
      setCurrent(0);
    } else {
      setCurrent(storeIndex);
    }
  }, [storeCarouselIndex]);

  useEffect(() => {
    setStyle({
      marginLeft: `${current * -switchWidth}px`,
      transition: 'all 0.3s ease-out',
    });

    dispatch(setCarouselIndex({ id: `${conditionsId}`, index: current }));
  }, [current]);

  const NextDisabled = () => {
    if (current + 1 > Math.min(current + 1, length - 1, CONDITIONS_LIMIT - 1)) {
      return true;
    }

    if (
      isHistoryViewer &&
      current >= Math.min(current + 1, children.length - 1, CONDITIONS_LIMIT - 1)
    ) {
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

  // useEffect(() => {
  //   return () => {
  //     setCurrent(length - 1);
  //   };
  // }, [addCarousel]);
  return (
    <>
      {addCarousel && deleteCarousel && (
        <Row
          justify="space-between"
          align="center"
          className="carouselBtnWrapper node-item-wrap"
        >
          <Row justify="center" align="center">
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={(e) => {
                  addCarousel(e);
                  setCurrent(length);
                }}
                disabled={current === CONDITIONS_LIMIT - 1}
              >
                <img
                  src={current === CONDITIONS_LIMIT - 1 ? icAddDisable : icAdd}
                  alt="icAdd"
                />
              </button>
            </Col>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={(e) => {
                  deleteCarousel(current);
                  setCurrent(current === 0 ? 0 : current - 1);
                }}
                disabled={length === 1}
              >
                <img src={length === 1 ? icDeleteDisable : icDelete} alt="icDelete" />
              </button>
            </Col>
          </Row>

          <Col>
            <p className="page">
              {current >= children.length
                ? undefined
                : `${current + 1}/${children.length}`}
            </p>
          </Col>
          <Row justify="center" align="center">
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={handlePrevClick}
                disabled={current === 0}
                // shape="round"
              >
                <img
                  src={current === 0 ? icCarouselPrevInactive : icCarouselPrevActive}
                  alt="carouselPrevBtn"
                />
              </button>
            </Col>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={handleNextClick}
                disabled={NextDisabled()}
                // shape="round"
              >
                <img
                  src={NextDisabled() ? icCarouselNextInactive : icCarouselNextActive}
                  alt="carouselNextBtn"
                />
              </button>
            </Col>
          </Row>
        </Row>
      )}
      <div
        role="presentation"
        style={{
          width: `${switchWidth}px`,
          overflowX: 'hidden',
        }}
        className="carouselComponent"
      >
        <div style={{ display: 'flex', overflowX: 'hidden', ...style }}>
          {children.map((c, i) => {
            return (
              <div
                style={{ width: `${switchWidth}px`, flex: 'none' }}
                key={`card-wrap-${i}`}
              >
                {i === current
                  ? c
                  : !isHistoryViewer && <div style={{ width: `${switchWidth}px` }}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

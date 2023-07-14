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
import { CONDITIONS_LIMIT } from '@modules';
import { setCarouselIndex } from '@store/botbuilderSlice';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface SwitchNodeCarouselProps {
  children: ReactNode[];
  conditionsId: string;
  addCarousel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SwitchNodeCarousel: FC<SwitchNodeCarouselProps> = ({
  conditionsId,
  children,
  addCarousel,
}) => {
  const switchWidth = 350;
  const [current, setCurrent] = useState(0);

  const [style, setStyle] = useState({
    marginLeft: `${current * -switchWidth}px`,
    transition: 'none',
  });

  const { t } = usePage();
  const { updateLine } = useUpdateLines();

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

    dispatch(setCarouselIndex({ id: conditionsId, index: current }));
  }, [current]);

  const NextDisabled = () => {
    console.log('@cur', current, length);
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
    // if (NextDisabled()) {
    //   return;
    // }
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
      {addCarousel && (
        <Row
          justify="space-between"
          align="center"
          className="carouselBtnWrapper node-item-wrap"
        >
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
            <Button
              onClick={(e) => {
                addCarousel(e);
                setCurrent(length);
              }}
              disabled={current === CONDITIONS_LIMIT - 1}
            >
              {t(`CONDITION_NODE_CASE_ADD`)}
            </Button>
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

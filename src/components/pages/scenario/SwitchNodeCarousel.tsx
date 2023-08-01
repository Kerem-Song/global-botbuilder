import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { CONDITIONS_LIMIT } from '@modules';
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
          <Row justify="center" align="center" gap={4}>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={(e) => {
                  addCarousel(e);
                  setCurrent(length);
                }}
                disabled={current === CONDITIONS_LIMIT - 1}
                data-button={'add'}
              />
            </Col>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={(e) => {
                  deleteCarousel(current);
                  setCurrent(current === 0 ? 0 : current - 1);
                }}
                disabled={length === 1}
                data-button={'delete'}
              />
            </Col>
          </Row>

          <Col>
            <p className="page">
              {current >= children.length
                ? undefined
                : `${current + 1}/${children.length}`}
            </p>
          </Col>
          <Row justify="center" align="center" gap={4}>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={handlePrevClick}
                disabled={current === 0}
                data-button={'prev'}
              />
            </Col>
            <Col>
              <button
                className="switchNodeCarouselBtn"
                onClick={handleNextClick}
                disabled={NextDisabled()}
                data-button={'next'}
              />
            </Col>
          </Row>
        </Row>
      )}
      <div
        role="presentation"
        style={{
          width: `${switchWidth}px`,
        }}
        className="carouselComponent"
      >
        <div style={{ display: 'flex', ...style }}>
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

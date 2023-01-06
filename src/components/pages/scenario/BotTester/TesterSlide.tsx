/* eslint-disable react/no-unknown-property */
import {
  icTesterNextActive,
  icTesterNextInactive,
  icTesterPrevActive,
  icTesterPrevInactive,
} from '@assets';
import { IHasChildren, IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ITesterSlideProps extends IHasChildren, IHasClassNameNStyle {
  quickReplies?: boolean;
  children: ReactNode[];
  gapSize: number;
}

export const TesterSlide = ({
  children,
  className,
  gapSize,
  quickReplies,
}: ITesterSlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const [style, setStyle] = useState({
    marginLeft: '0px',
    transition: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
  });

  useEffect(() => {
    if (slideRef.current && slideRef.current.children.length > 1) {
      let marginLeft = 0;
      for (let i = 0; i < current; i++) {
        marginLeft +=
          slideRef.current.children[i].getBoundingClientRect().width + gapSize;
      }
      setStyle({
        marginLeft: `${-marginLeft}px`,
        transition: 'all 0.3s ease-out',
        display: 'flex',
        justifyContent: 'flex-start',
      });
    } else {
      setStyle({
        marginLeft: '0px',
        transition: 'all 0.3s ease-out',
        display: 'flex',
        justifyContent: 'center',
      });
    }
  }, [current]);

  // useEffect(() => {
  //   if (slideRef.current && slideRef.current.children.length > current) {
  //     let marginLeft = 0;
  //     for (let i = 0; i < current; i++) {
  //       marginLeft +=
  //         slideRef.current.children[i].getBoundingClientRect().width + gapSize;
  //     }
  //     setStyle({
  //       marginLeft: `${-marginLeft}px`,
  //       transition: 'all 0.3s ease-out',
  //     });
  //   }
  // }, [current]);

  const handleNextClick = () => {
    setCurrent(Math.min(current + 1, children.length - 1));
  };

  const handlePrevClick = () => {
    setCurrent(Math.max(current - 1, 0));
  };

  const prevSliderContainer = classNames(className, 'luna-carousel-slide-left', {
    'luna-quickreply-slide-left': quickReplies,
  });
  const nextSliderContainer = classNames(className, 'luna-carousel-slide-right', {
    'luna-quickreply-slide-right': quickReplies,
  });

  return (
    <>
      <div className="botTesterSlide" style={{ ...style }} ref={slideRef}>
        {children}
      </div>
      <div className={prevSliderContainer}>
        <button className="slideBtns" disabled={current === 0} onClick={handlePrevClick}>
          <img
            src={current === 0 ? icTesterPrevInactive : icTesterPrevActive}
            alt="TesterSlidePrevBtn"
          />
        </button>
      </div>
      <div className={nextSliderContainer}>
        <button
          className="slideBtns"
          disabled={current + 1 === children.length}
          onClick={handleNextClick}
        >
          <img
            src={
              current + 1 === children.length ? icTesterNextInactive : icTesterNextActive
            }
            alt="TesterSlideNextBtn"
          />
        </button>
      </div>
    </>
  );
};

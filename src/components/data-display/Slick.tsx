import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useMemo } from 'react';
import Slider, { CustomArrowProps, Settings } from 'react-slick';

type sliderProps = {
  /** 슬라이더 아이템 요소 */
  children: React.ReactNode;

  /** 커스텀 클래스 */
  className?: string;

  /** 자동재생 (속도 설정시 number 타입으로) */
  autoplay?: boolean | number;

  /** 슬라이더 속도 */
  speed?: number;

  /** 반복 여부 */
  loop?: boolean;

  /** 슬라이더 도트 여부 */
  dots?: boolean;
};

export const Slick = ({
  children,
  autoplay = false,
  speed = 300,
  loop = false,
  dots = false,
}: sliderProps) => {
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => (
    <button
      {...props}
      className={'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')}
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      Previous
    </button>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => (
    <button
      {...props}
      className={
        'slick-next slick-arrow' +
        (slideCount && currentSlide === slideCount - 1 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={slideCount && currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      Next
    </button>
  );

  const settings = useMemo<Settings>(
    () => ({
      slidesToShow: 1,
      autoplay: Boolean(autoplay),
      autoplaySpeed: typeof autoplay === 'boolean' ? 3000 : autoplay,
      dots: dots,
      prevArrow: <SlickArrowLeft />,
      nextArrow: <SlickArrowRight />,
      dotsClass: 'slick-dots',
      draggable: false,
      infinite: loop,
      speed: speed,
    }),
    [autoplay, loop, speed],
  );

  return (
    <Slider lazyLoad="ondemand" {...settings}>
      {children}
    </Slider>
  );
};

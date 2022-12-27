import { icTesterNextActive, icTesterPrevActive } from '@assets';
import { IHasChildren, IHasClassNameNStyle } from '@models';
import classNames from 'classnames';

export interface ITesterSlideProps extends IHasChildren, IHasClassNameNStyle {
  quickReplies?: boolean;
}

export const TesterSlide = ({ children, className, quickReplies }: ITesterSlideProps) => {
  const prevSliderContainer = classNames(className, 'luna-carousel-slide', {
    'luna-quickreply-slide': quickReplies,
  });
  const nextSliderContainer = classNames(className, 'luna-carousel-slide-right', {
    'luna-quickreply-slide-right': quickReplies,
  });
  return (
    <div className="botTesterSlide">
      {children}
      <div className={prevSliderContainer}>
        <button className="slideBtns">
          <img src={icTesterPrevActive} alt="TesterSlidePrevBtn" />
        </button>
      </div>
      <div className={nextSliderContainer}>
        <button className="slideBtns">
          <img src={icTesterNextActive} alt="TesterSlideNextBtn" />
        </button>
      </div>
    </div>
  );
};

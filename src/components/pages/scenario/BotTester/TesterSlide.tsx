import { icTesterNextActive, icTesterPrevActive } from '@assets';

export const TesterSlide = () => {
  return (
    <>
      <div className="testerSlide">
        <button className="slideBtns">
          <img src={icTesterPrevActive} alt="TesterSlidePrevBtn" />
        </button>
      </div>
      <div className="testerSlide next">
        <button className="slideBtns">
          <img src={icTesterNextActive} alt="TesterSlideNextBtn" />
        </button>
      </div>
    </>
  );
};

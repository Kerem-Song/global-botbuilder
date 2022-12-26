import { icTesterNextActive, icTesterPrevActive } from '@assets';

export const TesterSlide = () => {
  return (
    <>
      <div className="testerSlide">
        <button className="slideBtns prevBtn">
          <img src={icTesterPrevActive} alt="TesterSlidePrevBtn" />
        </button>
      </div>
      <div className="testerSlide Next">
        <button className="slideBtns nextBtn">
          <img src={icTesterNextActive} alt="TesterSlideNextBtn" />
        </button>
      </div>
    </>
  );
};

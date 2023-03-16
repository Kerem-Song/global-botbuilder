import {
  icBackActive,
  icBackInactive,
  icNextActive,
  icNextInactive,
  icPrev,
} from '@assets';
import { Button } from '@components/general';
export const DeployPagination = () => {
  return (
    <div className="pageBtns">
      <Button disabled shape="ghost" className="prevBtn">
        <img src={icBackInactive} alt="prev" />
      </Button>
      <div className="pageNumBtns">
        <Button className="pageNumBtn" type="primary">
          1
        </Button>
        <Button className="pageNumBtn">2</Button>
        <Button className="pageNumBtn">3</Button>
      </div>
      <Button shape="ghost" className="nextBtn">
        <img src={icNextActive} alt="next"></img>
      </Button>
    </div>
  );
};

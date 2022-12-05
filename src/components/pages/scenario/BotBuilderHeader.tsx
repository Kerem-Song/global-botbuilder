import {
  icBtnTemple,
  icCaroCommerce,
  icCaroImg,
  icCaroList,
  icCommerce,
  icCondition,
  icImg,
  icList,
  icQuickBtn,
  icText,
} from '@assets';
import { Button } from '@components/general/Button';

export const BotBuilderHeader = () => {
  const cardNum = 12;
  return (
    <div className="botBuilderHeader">
      <div className="botBuilderMakerWrapper">
        <span className="cardNumWrapper">
          chat bubble <span className="cardNum">{cardNum}</span>
        </span>
        <div className="makingBtn">
          <span className="btnCategory">Single</span>
          <Button className="btnWrapper">
            <img src={icText} alt="icText"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icImg} alt="icImg"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icBtnTemple} alt="icBtnTemple"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icList} alt="icList"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icCommerce} alt="icCommerce"></img>
          </Button>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Carousel</span>
          <Button className="btnWrapper">
            <img src={icCaroImg} alt="icCaroImg"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icCaroList} alt="icCaroList"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icCaroCommerce} alt="icCaroCommerce"></img>
          </Button>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Button</span>
          <Button className="btnWrapper">
            <img src={icQuickBtn} alt="icQuickBtn"></img>
          </Button>
          <Button className="btnWrapper">
            <img src={icCondition} alt="icCondition"></img>
          </Button>
        </div>
      </div>
      <div className="saveBtn">
        <Button small type="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

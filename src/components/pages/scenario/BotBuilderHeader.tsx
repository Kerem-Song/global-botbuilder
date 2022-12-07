import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';

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
          <Col className="btnWrapper">
            <Button className="icon icText" />
            <Button className="icon icImg" />
            <Button className="icon icBtnTemple" />
            <Button className="icon icList" />
            <Button className="icon icCommerce" />
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Carousel</span>
          <Col className="btnWrapper">
            <Button className="icon icCaroImg" />
            <Button className="icon icCaroList" />
            <Button className="icon icCaroCommerce" />
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Button</span>
          <Col className="btnWrapper">
            <Button className="icon icQuickBtn" />
            <Button className="icon icCondition" />
          </Col>
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

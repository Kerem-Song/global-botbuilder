import { Button } from '@components/general/Button';
import { Col, Row } from '@components/layout';
import { IBotBuilderZoomBtn } from '@models/interfaces/IBotBuilderZoomBtn';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { updateLineAll } from './LineContainer';

export const BotBuilderZoomBtn = ({
  zoomIn,
  zoomOut,
  canvasScale,
}: IBotBuilderZoomBtn) => {
  const dispath = useDispatch();
  const rate = Math.floor(canvasScale * 100);
  return (
    <Row className="botBuilderCanvasBtn">
      <Col className="botBuilderZoomBtn">
        <Button small shape="ghost" className="minusZoomBtn" onClick={zoomOut} />
        <span>{rate}</span>
        <Button small shape="ghost" className="plusZoomBtn" onClick={zoomIn} />
      </Col>
      <Col className="operationBtn">
        <Button
          small
          className="undo"
          onClick={() => {
            updateLineAll();
            dispath(ActionCreators.undo());
          }}
        />
        <Button
          small
          className="redo"
          onClick={() => {
            updateLineAll();
            dispath(ActionCreators.redo());
          }}
        />
      </Col>
    </Row>
  );
};

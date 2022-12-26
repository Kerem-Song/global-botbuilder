import { Button } from '@components/general/Button';
import { Col, Row } from '@components/layout';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { zoomIn, zoomOut } from '@store/botbuilderSlice';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

export const BotBuilderZoomBtn = () => {
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const scale = useRootState((state) => state.botBuilderReducer.scale);

  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  return (
    <Row className="botBuilderCanvasBtn">
      <Col className="botBuilderZoomBtn">
        <Button small shape="ghost" className="minusZoomBtn" onClick={handleZoomOut} />
        <span>{scale * 100}</span>
        <Button small shape="ghost" className="plusZoomBtn" onClick={handleZoomIn} />
      </Col>
      <Col className="operationBtn">
        <Button
          small
          className="undo"
          onClick={() => {
            updateLineAll();
            dispatch(ActionCreators.undo());
          }}
        />
        <Button
          small
          className="redo"
          onClick={() => {
            updateLineAll();
            dispatch(ActionCreators.redo());
          }}
        />
      </Col>
    </Row>
  );
};

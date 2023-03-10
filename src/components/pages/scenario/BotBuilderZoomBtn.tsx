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
  const past = useRootState((state) => state.makingNodeSliceReducer.past).length !== 0;
  const future =
    useRootState((state) => state.makingNodeSliceReducer.future).length !== 0;

  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  console.log('past', past);
  console.log('future', future);

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
          disabled={!past}
          onClick={() => {
            updateLineAll();
            dispatch(ActionCreators.undo());
          }}
        />
        <Button
          small
          className="redo"
          disabled={!future}
          onClick={() => {
            updateLineAll();
            dispatch(ActionCreators.redo());
          }}
        />
      </Col>
    </Row>
  );
};

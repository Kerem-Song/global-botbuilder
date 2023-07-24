import { Checkbox, Switch } from '@components/data-entry';
import { Button } from '@components/general/Button';
import { Col, Row, Space } from '@components/layout';
import { useRootState } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setIsBeziderMode, zoomIn, zoomOut } from '@store/botbuilderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

export const BotBuilderZoomBtn = () => {
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const past = useRootState((state) => state.makingNodeSliceReducer.past).length !== 0;
  const future =
    useRootState((state) => state.makingNodeSliceReducer.future).length !== 0;
  const isBezierMode = useRootState((state) => state.botBuilderReducer.isBezierMode);
  const isHistoryViewer = useHistoryViewerMatch();
  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  useEffect(() => {
    dispatch(setIsBeziderMode(localStorage.getItem('isBezierMode') === 'B'));
  }, []);

  useEffect(() => {
    updateLineAll();
    localStorage.setItem('isBezierMode', isBezierMode ? 'B' : 'L');
  }, [isBezierMode]);

  console.log('past', past);
  console.log('future', future);

  return (
    <Space>
      <Row className="botBuilderCanvasBtn">
        <Col className="botBuilderZoomBtn">
          <Button small shape="ghost" className="minusZoomBtn" onClick={handleZoomOut} />
          <span>{Math.round(scale * 100)}</span>
          <Button small shape="ghost" className="plusZoomBtn" onClick={handleZoomIn} />
        </Col>
        {!isHistoryViewer && (
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
        )}

        <Col className="p-l-10">
          <Button small onClick={() => dispatch(setIsBeziderMode(!isBezierMode))}>
            {isBezierMode ? 'B' : 'L'}
          </Button>
        </Col>
      </Row>
    </Space>
  );
};

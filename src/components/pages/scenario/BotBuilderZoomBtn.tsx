import { Tooltip } from '@components';
import { Button } from '@components/general/Button';
import { Col, Row, Space } from '@components/layout';
import { usePage, useRootState } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setIsBeziderMode, zoomIn, zoomOut } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { SearchingNodeInput } from './SearchingNodeInput';

export const BotBuilderZoomBtn = () => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const past = useRootState((state) => state.makingNodeSliceReducer.past).length !== 0;
  const future =
    useRootState((state) => state.makingNodeSliceReducer.future).length !== 0;
  const isBezierMode = useRootState((state) => state.botBuilderReducer.isBezierMode);
  const isHistoryViewer = useHistoryViewerMatch();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  useEffect(() => {
    // dispatch(setIsBeziderMode(localStorage.getItem('isBezierMode') === 'B'));
    dispatch(setIsBeziderMode(isBezierMode ?? false));
  }, []);

  useEffect(() => {
    updateLineAll();
    // localStorage.setItem('isBezierMode', isBezierMode ? 'B' : 'L');
    dispatch(setIsBeziderMode(isBezierMode ?? false));
  }, [isBezierMode]);

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

        <Col className="lineShapeSelectorWrapper">
          <Tooltip tooltip={t(`LINE_STRAIGHT`)}>
            <button
              className={classNames('lineShapeSelector straight', {
                selected: !isBezierMode,
              })}
              onClick={() => dispatch(setIsBeziderMode(false))}
            />
          </Tooltip>
          <Tooltip tooltip={t(`LINE_CURVE`)}>
            <button
              className={classNames('lineShapeSelector curved', {
                selected: isBezierMode,
              })}
              onClick={() => dispatch(setIsBeziderMode(true))}
            />
          </Tooltip>
        </Col>
        {import.meta.env.DEV && (
          <Col className="searchingNodeInputWrapper">
            <SearchingNodeInput nodes={nodes} />
          </Col>
        )}
      </Row>
    </Space>
  );
};

import { icNodeBottom } from '@assets';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow } from '@models';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConnectLine } from './ConnectLine';

export const LineContainer: FC = () => {
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const lines = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const selectedLine = useRootState((state) => state.botBuilderReducer.selected);
  const guideInfo = useRootState((state) => state.botBuilderReducer.guideInfo);

  useEffect(() => {
    updateLineAll();
    console.log(lines);
  }, [lines]);

  const handleLineClick = useCallback((l: IArrow) => {
    dispatch(setSelected(l));
  }, []);

  const handleLineDelete = useCallback((l: IArrow) => {
    dispatch(removeItem(l));
  }, []);

  return (
    <>
      {lines.map((l) => (
        <ConnectLine
          onClick={() => {
            handleLineClick(l);
          }}
          key={`${l.start}-${l.end}`}
          startId={l.start}
          updateKey={l.updateKey}
          endId={l.end}
          type={l.type}
          isNextNode={l.isNextNode}
          active={selectedLine === l}
          onDelete={() => handleLineDelete(l)}
        />
      ))}
      {guideInfo ? (
        <div
          style={{
            position: 'absolute',
            visibility: 'hidden',
          }}
          id="icGuide"
        >
          <img src={icNodeBottom} alt="icNodeBottom" />
        </div>
      ) : undefined}
      {guideInfo ? (
        <ConnectLine
          startId={guideInfo.startId}
          endId="icGuide"
          type={guideInfo.type}
          isNextNode={guideInfo.isNext}
          updateKey={guideInfo.nodeId}
          key={`${guideInfo.startId}-icGuide`}
        />
      ) : undefined}
    </>
  );
};

import { icNodeBottom } from '@assets';
import { usePage, useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow } from '@models';
import { NODE_PREFIX } from '@modules';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConnectLine } from './ConnectLine';

export const LineContainer: FC = () => {
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const { isReadOnly } = usePage();
  const lines = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const selectedLine = useRootState((state) => state.botBuilderReducer.selected);
  const guideInfo = useRootState((state) => state.botBuilderReducer.guideInfo);

  useEffect(() => {
    updateLineAll();
  }, [lines]);

  const handleLineClick = useCallback((l: IArrow) => {
    if (isReadOnly) {
      return;
    }
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
          highlight={
            l.start === `${NODE_PREFIX}${selectedLine}` ||
            l.end === `${NODE_PREFIX}${selectedLine}` ||
            l.updateKey === `${NODE_PREFIX}${selectedLine}`
          }
          isSelected={selectedLine !== undefined}
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

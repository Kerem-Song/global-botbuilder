import { icNodeBottom } from '@assets';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow } from '@models';
import { setSelected } from '@store/botbuilderSlice';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConnectLine } from './ConnectLine';

export const LineContainer: FC = () => {
  const dispatch = useDispatch();
  const { updateLineAll } = useUpdateLines();
  const lines = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const selectedLine = useRootState((state) => state.botBuilderReducer.selected);
  const guideStart = useRootState((state) => state.botBuilderReducer.guideStart);

  useEffect(() => {
    updateLineAll();
  }, [lines]);

  const handleLineClick = useCallback((l: IArrow) => {
    dispatch(setSelected(l));
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
          isNextNode={l.isNextNode}
          active={selectedLine === l}
        />
      ))}
      {guideStart ? (
        <div
          style={{
            position: 'absolute',
            visibility: 'hidden',
          }}
          id="icBottomGuide"
        >
          <img src={icNodeBottom} alt="icNodeBottom" />
        </div>
      ) : undefined}
      {guideStart ? (
        <ConnectLine startId={guideStart} endId="icBottomGuide" />
      ) : undefined}
    </>
  );
};

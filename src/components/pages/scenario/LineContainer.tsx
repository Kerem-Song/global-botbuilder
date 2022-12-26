import { icNodeBottom } from '@assets';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow } from '@models';
import { setSelected } from '@store/botbuilderSlice';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConnectLine } from './ConnectLine';

export interface ILineContainerProps {
  lines: IArrow[];
}

export const LineContainer: FC<ILineContainerProps> = ({ lines }) => {
  const dispatch = useDispatch();
  const { updateLineAll, addUpdateLines } = useUpdateLines();
  const selectedLine = useRootState((state) => state.botBuilderReducer.selected);
  const guideStart = useRootState((state) => state.botBuilderReducer.guideStart);

  useEffect(() => {
    updateLineAll();
  }, [lines]);

  return (
    <>
      {lines.map((l, i) => (
        <ConnectLine
          onClick={() => {
            dispatch(setSelected(l));
          }}
          key={i}
          startId={l.start}
          endId={l.end}
          addUpdateLines={addUpdateLines}
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
        <ConnectLine
          startId={guideStart}
          endId="icBottomGuide"
          addUpdateLines={addUpdateLines}
        />
      ) : undefined}
    </>
  );
};

import { useRootState } from '@hooks';
import { IArrow } from '@models';
import { setSelected } from '@store/botbuilderSlice';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConnectLine } from './ConnectLine';

export interface ILineContainerProps {
  lines: IArrow[];
}

let updateStack: { (): void }[] = [];
let updateLines: { start: string; end: string; update: () => void }[] = [];

export const updateLineAll = () => {
  setTimeout(() => {
    updateLines.map((x) => x.update());
  }, 10);
};

export const updateLine = (id: string) => {
  updateStack = [];
  const filtered = updateLines.filter((f) => f.start === id || f.end === id);
  filtered.map((f) => updateStack.push(f.update));
  setTimeout(() => {
    updateStack.map((f) => {
      f();
    });
    updateStack = [];
  }, 10);
};

export const LineContainer: FC<ILineContainerProps> = ({ lines }) => {
  const dispatch = useDispatch();
  const selectedLine = useRootState((state) => state.botBuilderReducer.selected);
  updateLines = [];
  const addUpdateLines = (start: string, end: string, update: () => void) => {
    updateLines.push({ start, end, update });
  };

  useEffect(() => {
    updateLines.map((ul) => ul.update());
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
    </>
  );
};

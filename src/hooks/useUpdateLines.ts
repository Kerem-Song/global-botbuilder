import { IArrow } from '@models';
import { useEffect } from 'react';

let updateStack: { (): void }[] = [];
let updateLines: { start: string; end: string; update: () => void }[] = [];

export const updateLineAll = () => {
  setTimeout(() => {
    updateLines.map((x) => x.update());
  }, 10);
};

const updateLine = (id: string) => {
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
const addUpdateLines = (start: string, end: string, update: () => void) => {
  updateLines.push({ start, end, update });
};

export const useUpdateLines = () => {
  updateLines = [];

  return { updateLineAll, updateLine, addUpdateLines };
};

import { IArrow } from '@models';
import { useEffect } from 'react';

let updateStack: { (): void }[] = [];
const updateLines: { start: string; end: string; update: () => void }[] = [];

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

const removeUpdateLines = (start: string, end: string) => {
  const existsIndex = updateLines.findIndex((x) => x.start === start && x.end === end);
  if (existsIndex >= 0) {
    console.log(start, end, existsIndex);
    updateLines.splice(existsIndex, 1);
  }
};

const addUpdateLines = (start: string, end: string, update: () => void) => {
  removeUpdateLines(start, end);
  updateLines.push({ start, end, update });
};

// const initUpdateLines = () => {
//   updateLines = [];
// };

export const useUpdateLines = () => {
  return { updateLineAll, updateLine, addUpdateLines, removeUpdateLines };
};

let updateStack: { (): void }[] = [];
const updateLines: { start: string; end: string; update: () => void }[] = [];

export const updateLineAll = () => {
  setTimeout(() => {
    updateLines.map((x) => x.update());
  }, 10);
};

const updateLine = (id: string) => {
  const filtered = updateLines.filter((f) => f.start === id || f.end === id);
  updateStack = filtered.map((f) => f.update);
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

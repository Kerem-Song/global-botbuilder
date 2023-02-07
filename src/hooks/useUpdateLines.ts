let updateStack: { (): void }[] = [];
const updateLines: {
  start: string;
  startKey: string;
  end: string;
  update: () => void;
}[] = [];

const updateLineAll = () => {
  setTimeout(() => {
    updateLines.map((x) => x.update());
  }, 10);
};

const updateLine = (id: string) => {
  const filtered = updateLines.filter((f) => f.start === id || f.end === id);
  const existsUpdateStackLength = updateStack.length;
  updateStack = filtered.map((f) => f.update);
  if (existsUpdateStackLength === 0) {
    setTimeout(() => {
      updateStack.map((f) => {
        f();
      });
      updateStack = [];
    }, 10);
  }
};

const removeUpdateLines = (start: string, startKey: string, end: string) => {
  const existsIndex = updateLines.findIndex(
    (x) => x.start === start && x.end === end && x.startKey === startKey,
  );
  if (existsIndex >= 0) {
    updateLines.splice(existsIndex, 1);
  }
};

const addUpdateLines = (
  start: string,
  startKey: string,
  end: string,
  update: () => void,
) => {
  removeUpdateLines(start, startKey, end);
  updateLines.push({ start, startKey, end, update });
};

// const initUpdateLines = () => {
//   updateLines = [];
// };

export const useUpdateLines = () => {
  return { updateLineAll, updateLine, addUpdateLines, removeUpdateLines };
};

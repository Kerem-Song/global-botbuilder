export type IdType = 'node' | 'view' | 'ctrl';
const rnd = () => {
  return Math.floor(Math.random() * 61439) + 4096;
};
export const idGen = {
  generate: (prefix: IdType) => {
    let resultPreFix: string = prefix;

    if (prefix.length > 4) {
      resultPreFix = prefix.substring(0, 4);
    } else if (prefix.length < 4) {
      resultPreFix.padStart(4, 'a');
    }

    const x162 = Date.now().toString(16).padStart(16, '0');

    const result = `${resultPreFix}${x162}${rnd().toString(16)}`;
    return result;
  },
};

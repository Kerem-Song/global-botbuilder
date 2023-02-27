import parse from 'html-react-parser';

export const util = {
  replaceKeywordMark: (text: string, keyword?: string) => {
    return parse(
      text.replace(new RegExp(keyword!, 'gi'), (match) => {
        if (match) {
          return `<mark>${match}</mark>`;
        } else {
          return '';
        }
      }),
    );
  },
  range: (length: number) => {
    return Array.from({ length }, (_, index) => index + 1);
  },
  random: (max: number) => {
    return Math.random() * max + 1;
  },
  copyClipboard: async (text: string | undefined) => {
    await navigator.clipboard.writeText(text || '');
  },
};

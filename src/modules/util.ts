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
};

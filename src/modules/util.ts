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
  pad: (n: number) => {
    return n < 10 ? `0${n.toString()}` : n.toString();
  },
  formatDateTime: (d: Date) => {
    return (
      d.getFullYear() +
      '-' +
      util.pad(d.getMonth() + 1) +
      '-' +
      util.pad(d.getDate()) +
      ' ' +
      util.pad(d.getHours()) +
      ':' +
      util.pad(d.getMinutes()) +
      ':' +
      util.pad(d.getSeconds())
    );
  },
  TriggerInputOnChange: (input: HTMLInputElement | null, value: string) => {
    if (!input) {
      return;
    }
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    nativeInputValueSetter?.call(input, value);
    const ev2 = new Event('input', { bubbles: true });
    console.log('befor event');
    input.dispatchEvent(ev2);
    console.log('after event');
  },
};

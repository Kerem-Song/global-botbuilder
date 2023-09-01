import { StaffType } from '@models';
import parse from 'html-react-parser';

import { menuModule } from './menuModule';

export const util = {
  getEnterBotPath: (type?: StaffType, role?: number) => {
    const goto = menuModule.menu.find((x) => util.checkRole(x.role, type, role));
    if (goto) {
      return goto.url;
    } else {
      return 'scenario/start';
    }
  },
  checkRole: (checkRole: number, type?: StaffType, role?: number) => {
    // 어드민은 모든 권한
    if (type === StaffType.Administrator) {
      return true;
    }

    if (!role) {
      return false;
    }

    return (checkRole & role) === checkRole;
  },
  replaceKeywordMark: (text: string, keyword?: string, isStart = false) => {
    if (!keyword) {
      return text;
    }

    const escapeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/gi, '\\$&');

    return parse(
      text.replace(
        new RegExp(`${isStart ? '\\s|^' : ''}${escapeKeyword}`, 'gi'),
        (match) => {
          if (match) {
            return `<mark>${match}</mark>`;
          } else {
            return '';
          }
        },
      ),
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
    if (n < 0) {
      return `-${n.toString().slice(1).padStart(2, '0')}`;
    } else {
      return n < 10 ? `0${n.toString()}` : n.toString();
    }
  },
  // toLocaleDateTimeStringFromUtc: (date: Date) => {
  //   const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  //   const offset = date.getTimezoneOffset() / 60;
  //   const hours = date.getHours();
  //   newDate.setHours(hours - offset);

  //   return newDate.toLocaleString();
  // },
  toLocaleDateTimeString: (date: Date) => {
    return date.toLocaleString(Intl.Locale.name, { hour12: false });
  },
  // toLocaleDateStringFromUtc: (date: Date) => {
  //   console.log('date', date);
  //   const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  //   const offset = date.getTimezoneOffset() / 60;
  //   const hours = date.getHours();
  //   newDate.setHours(hours - offset);
  //   console.log('newDate', newDate);
  //   return newDate.toLocaleDateString();
  // },
  toLocaleDateString: (date: Date) => {
    return date.toLocaleDateString();
  },
  // formatDateTime: (d: Date) => {
  //   return (
  //     d.getFullYear() +
  //     '.' +
  //     util.pad(d.getMonth() + 1) +
  //     '.' +
  //     util.pad(d.getDate()) +
  //     ' ' +
  //     util.pad(d.getHours()) +
  //     ':' +
  //     util.pad(d.getMinutes()) +
  //     ':' +
  //     util.pad(d.getSeconds())
  //   );
  // },
  toOffsetString: (minute: number) => {
    const h = minute / 60;
    const m = minute % 60;
    return `${minute > 0 ? '+' : ''}${util.pad(h)}:${util.pad(m)}`;
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

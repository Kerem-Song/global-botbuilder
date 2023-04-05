export const supportedLngs = ['ko', 'en', 'ja', 'key'];
export const NEXT_BUTTON_PREFIX = 'next-';
export const NODE_PREFIX = 'node-';
export const TRUE_SUFFIX = '-true';
export const FALSE_SUFFIX = '-false';
export const NODE_DRAG_FACTOR = 10;
export const QUICK_MAX_COUNT = 10;
export const EMOJI_REGEX =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
// eslint-disable-next-line no-useless-escape
export const SPECIAL_CHARACTOR_REGEX = /[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/g;
export const CONTROL_CHARACTOR_REGEX = /\p{Cc}/gu;
export const BOTNAME_REGEX =
  /^([\p{L}]|[\d]|[_-]|[\u0a80-\u0aff]|[\u0900-\u097F]|[\u0780-\u07BF]|[\u0E80-\u0EFF]|[\u0D00-\u0D7F]|[\u1000-\u109F]|[\u0980-\u09FF]|[\u0D80-\u0DFF]|[\u0600-\u06FF]|[\u0B00-\u0B7F]|[\u0C80-\u0CFF]|[\u1780-\u17FF]|[\u0B80-\u0BFF]|[\u0E00-\u0E7F]|[\u0C00-\u0C7F]|[\u0A00-\u0A7F]|[\u0590-\u05ff])+$/gu;

export const supportedLngs = ['ko', 'en', 'ja', 'key'];
export const NEXT_BUTTON_PREFIX = 'next-';
export const NODE_PREFIX = 'node-';
export const TRUE_SUFFIX = '-true';
export const FALSE_SUFFIX = '-false';
export const CONDITION_SUFFIX = '-condition-';
export const DEFAULT_SUFFIX = '-default';
export const CANVAS_LIMIT = 10000;
export const NODE_DRAG_FACTOR = 10;
export const QUICK_MAX_COUNT = 10;
export const CONDITIONS_LIMIT = 11;
export const SYS_BOT_ICON = '@sys.bot-icon';
export const SYS_BRAND_CURRENCY = '@sys.brand-currency';
export const EMOJI_REGEX =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
// eslint-disable-next-line no-useless-escape
export const SPECIAL_CHARACTOR_REGEX = /[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/g;
export const CONTROL_CHARACTOR_REGEX = /\p{Cc}/gu;
export const BOTNAME_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^([\p{L}]|\d| |[~!#$%^&*()_+-=\[\]|,.\/:<>\\?]|[\u0a80-\u0aff]|[\u0900-\u097F]|[\u0780-\u07BF]|[\u0E80-\u0EFF]|[\u0D00-\u0D7F]|[\u1000-\u109F]|[\u0980-\u09FF]|[\u0D80-\u0DFF]|[\u0600-\u06FF]|[\u0B00-\u0B7F]|[\u0C80-\u0CFF]|[\u1780-\u17FF]|[\u0B80-\u0BFF]|[\u0E00-\u0E7F]|[\u0C00-\u0C7F]|[\u0A00-\u0A7F]|[\u0590-\u05ff])+$/gu;
export const ENTITY_NAME_REGEX =
  /^([\p{L}]|[\d]|[_-]|[\u0a80-\u0aff]|[\u0900-\u097F]|[\u0780-\u07BF]|[\u0E80-\u0EFF]|[\u0D00-\u0D7F]|[\u1000-\u109F]|[\u0980-\u09FF]|[\u0D80-\u0DFF]|[\u0600-\u06FF]|[\u0B00-\u0B7F]|[\u0C80-\u0CFF]|[\u1780-\u17FF]|[\u0B80-\u0BFF]|[\u0E00-\u0E7F]|[\u0C00-\u0C7F]|[\u0A00-\u0A7F]|[\u0590-\u05ff])+$/gu;

export const PARAMETER_REGEX_FIRST_LETTER = /^[a-zA-Z_.]([a-zA-Z\d]|[-_])*/gu;
export const PARAMETER_REGEX_NEXT_LETTER_AFTER_DOT = /^\.[a-zA-Z_].*$/u;
export const PARAMETER_REGEX = /^\.?([a-zA-Z]|[_])([a-zA-Z\d]|[-_])*$/gu;

export const ENTRY_REGEX = /[\p{Cc}]+/gu;
export const CONDITION_PARAMETER_REGEX =
  /^(?:(?=@.*)\.?([\\@0-9a-zA-Z-_.])*|(?:(?=\{\{.*)[\\{a-zA-Z0-9_\-\\}]*|(?:(?!\{.*).*)))$/gu;
export const ENG_NUM_UNDERSCORE_REGEX = /^\.?\w*\d*$/gu;
// export const ENG_NUM_UNDERSCORE_REGEX = /^\.?\w*\d*$/gu;

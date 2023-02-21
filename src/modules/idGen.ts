export const ID_TYPES = {
  NODE: 'node',
  VIEW: 'view',
  CTRL: 'ctrl',
  PROFILE: 'profile',
} as const;

export type IdType = typeof ID_TYPES[keyof typeof ID_TYPES];

const rnd = () => {
  return Math.floor(Math.random() * 61439) + 4096;
};

export const ID_GEN = {
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

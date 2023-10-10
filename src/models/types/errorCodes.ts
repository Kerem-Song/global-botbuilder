import { ValueOf } from './ValueOf';

export const errorCodes = {
  7670: 'ROLE_NOT_FOUND',
} as const;

export type ErrorType = keyof typeof errorCodes;

export type ErrorValueType = ValueOf<typeof errorCodes>;

export type ErrorExecuteType = {
  callback?: () => void;
};

export type ErrorExecuterType = {
  [key in ErrorValueType]: ErrorExecuteType;
};

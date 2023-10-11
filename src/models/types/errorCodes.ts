import { ValueOf } from './ValueOf';

export const errorCodes = {
  7670: 'ROLE_NOT_FOUND',
  7301: 'ALREADY_EXIST_FLOW_NAME',
  7604: 'FLOW_DELETE',
  7610: 'INVALIDATE_DATA',
  7614: 'DUPLICATE_FLOW_ALIAS',
  7638: 'DUPLICATE_NODE_ID',
} as const;

export type ErrorType = keyof typeof errorCodes;

export type ErrorValueType = ValueOf<typeof errorCodes>;

export type ErrorExecuteType = {
  callback?: () => void;
};

export type ErrorExecuterType = {
  [key in ErrorValueType]: ErrorExecuteType;
};

import { ValueOf } from './ValueOf';

export const basicScenarioTypes = {
  fallback: 'fallback',
  start: 'start',
} as const;

export type BasicScnarioType = ValueOf<typeof basicScenarioTypes>;

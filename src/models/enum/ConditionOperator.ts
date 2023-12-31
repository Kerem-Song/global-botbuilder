export enum ConditionOperator {
  Is = 1 << 1,
  IsNot = 1 << 2,
  // StartWith = 1 << 3,
  // EndWith = 1 << 4,
  Contain = 1 << 5,
  Any = 1 << 10,
  //NotContain = 1 << 9,
  LessThan = 1 << 7,
  LessThanOrEqual = 1 << 11,
  GreaterThan = 1 << 6,
  GreaterThanOrEqual = 1 << 12,
  Regex = 1 << 8,
}

export type ConditionOperatorKeys = keyof typeof ConditionOperator;

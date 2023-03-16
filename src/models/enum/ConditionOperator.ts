export enum ConditionOperator {
  Is = 1 << 1,
  IsNot = 1 << 2,
  StartWith = 1 << 3,
  EndWith = 1 << 4,
  Contain = 1 << 5,
  //NotContain = 1 << 9,
  GreaterThan = 1 << 6,
  LessThan = 1 << 7,
  Regex = 1 << 8,
}

export type ConditionOperatorKeys = keyof typeof ConditionOperator;

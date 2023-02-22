export enum VariableKind {
  Unknown = 0,
  Parameter = 1 << 1,
  UserEntity = 1 << 3,
  SystemEntity = 1 << 2,
}

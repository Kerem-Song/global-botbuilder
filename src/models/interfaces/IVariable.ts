import { VariableKind } from '@models/enum';

export interface IVariable {
  name: string;
  usingName: string;
  kind: VariableKind;
}

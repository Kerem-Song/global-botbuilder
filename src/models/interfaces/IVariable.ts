export interface ISearchParameter {
  sessionToken: string;
}

export interface IVariableList {
  name: string;
  defaultValue: string | null;
  formatType: number | null;
  id: string;
}

export interface ISearchParameter {
  sessionToken: string;
}
export interface IVariableList {
  name: string;
  defaultValue: string | null;
  formatType: number | null;
  id: string;
}

export interface ISaveParameterData {
  name: string;
  defaultValue: string | null;
  formatType: number;
  id?: string;
}

export interface ISaveParameter {
  sessionToken: string;
  data: ISaveParameterData;
}

export interface IDeleteParameter {
  sessionToken: string;
  parameterId: string | undefined;
}

export interface IResponseDeleteParameter {
  result: boolean;
  exception?: string | null;
  isSuccess?: boolean;
}

export interface IGetParameterFormats {
  formatType: number;
  cultureInfo: string;
  example: string;
  groupName: string;
  formatStr: string;
}

export interface IPararmeterList {
  value: number;
  label: string;
}

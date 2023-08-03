import { IException } from './IResponse';
import { IReq } from './req';

export interface ISearchParameter {
  sessionToken: string;
}
export interface IParameterList {
  name: string;
  defaultValue: string | null;
  formatType: number | null;
  id: string;
  using: boolean;
}

export interface ISaveParameterData {
  name: string;
  defaultValue: string | null;
  formatType: number;
  id?: string;
}

export interface ISaveParameter extends IReq {
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
  newToken?: string | null;
}

export interface IGetParameterFormats {
  formatType: number;
  cultureInfo: string;
  example: string;
  groupName: string;
  formatStr: string;
}

export interface IPararmeterFormatList {
  value: number;
  label: string;
}

export interface IResponseSaveParameter<T> {
  result: T;
  exception: IException;
  isSuccess: boolean;
  newToken: string | null;
}

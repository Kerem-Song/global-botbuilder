import { IResponse } from './IResponse';

export interface IHasResults<T> extends IResponse {
  result: T[];
}

import { IResponse } from './IResponse';

export interface IHasResult<T> extends IResponse {
  result: T;
}

import { IException } from '@models';

import { IReq } from './req';

export interface ISearchEntryGroup {
  sessionToken: string;
  countPerPage: number;
}

export interface IResponseEntryItems {
  id: string;
  name: string;
  usingName: string;
  entries: string[];
}

export interface IEntriesModel {
  representativeEntry: string;
  synonym?: string[];
}

export interface ISaveEntryGroup extends IReq {
  sessionToken?: string;
  name: string;
  isRegex?: boolean;
  entryGroupType?: number;
  entries: IEntriesModel[];
  entryGroupid?: string;
}

export interface IResponseSaveEntryGroup {
  id: string;
  isSys: boolean;
  name: string;
  entryGroupType: number;
  usingName: string;
  entryStr: string;
  entries?: IEntriesModel[];
}

export interface IGetEntryGroup {
  sessionToken: string;
  entryGroupId: string;
  isSys: boolean;
}

export interface IDeleteEntryGroup {
  sessionToken?: string;
  entryGroupId: string;
}

export interface IResponseEntity<T> {
  result: T;
  exception: IException;
  isSuccess: boolean;
}

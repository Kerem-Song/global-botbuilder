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

export interface ISaveEntryGroup {
  sessionToken?: string;
  name: string;
  isRegex: boolean;
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
  entries?: IEntriesModel[] | string;
}

export interface IEntryFormModel {
  entry: string;
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

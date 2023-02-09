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

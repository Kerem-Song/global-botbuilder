export interface IHistoryCondition {
  category: string;
  year: string;
}

export interface ISearchHistoryData {
  botId: string;
  category: string;
  year: string;
}

export interface IGetHistoryList {
  sessionToken: string;
  pageNo?: number;
  countPerPage: number;
}

export interface IResponseHistoryItems {
  id: string;
  createUtc: string;
  actorEmail: string;
  actorName: string;
  name: string;
  status: boolean;
  createAt: string;
  // category: string;
  // title: string;
  // desc: string;
}

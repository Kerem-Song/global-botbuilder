export const HISTORY_CATEGORY_TYPES = {
  SCENARIO: 1 << 1,
  INTENT: 1 << 2,
  SETTING: 1 << 3,
  DEPLOYEMNT: 1 << 4,
  ETC: 1 << 5,
} as const;

export type ValueOf<T> = T[keyof T];

export type THistoryCategoryValues = ValueOf<typeof HISTORY_CATEGORY_TYPES>;
export interface IHistoryCondition {
  category: THistoryCategoryValues;
  year: string;
}

export interface ISearchHistoryData {
  botId: string;
  category: THistoryCategoryValues;
  year?: string;
}

export interface IGetHistoryList {
  botId: string;
  category?: THistoryCategoryValues;
  year?: number;
  pageNo: number;
  countPerPage: number;
}

// 봇빌더 히스토리 값 참고 https://lunasoft.atlassian.net/wiki/spaces/globaltft/pages/4307222806
export type IChangeLogType =
  | 1001
  | 1002
  | 1003
  | 1006
  | 1007
  | 1008
  | 1009
  | 2001
  | 2002
  | 2003
  | 2004
  | 2005
  | 2006
  | 2007
  | 2008
  | 2009
  | 2010
  | 2011
  | 2012
  | 2013
  | 2014
  | 2015
  | 3001
  | 3002
  | 3003
  | 3004
  | 3005
  | 4001
  | 4002
  | 9001
  | 9002
  | 9003;

export interface IResponseHistoryItem {
  id: string;
  changeLogType: IChangeLogType;
  createUtc: string;
  actorEmail: string;
  actorName: string;
  channelName: string | null;
  botName: string | null;
  intentName: string | null;
  entityName: string;
  paramName: string;
  name: string;
  status: boolean;
  createAt: string;
  no: number | null;
  flowName: string | null;
}

export interface IHistoryListRes {
  items: IResponseHistoryItem[];
  pagePerCount: number;
  currentPage: number;
  total: number;
  totalPage: number;
}

export const HISTORY_CATEGORY_TYPES = {
  SCENARIO: 1 << 1, //2
  INTENT: 1 << 2, //4
  SETTING: 1 << 3, //8
  DEPLOYEMNT: 1 << 4, //16
  ETC: 1 << 5, //32
} as const;

type ValueOf<T> = T[keyof T];

export type THistoryCategoryValues = ValueOf<typeof HISTORY_CATEGORY_TYPES>;
export interface IHistoryCondition {
  category?: THistoryCategoryValues;
  year?: string;
  filteredCategory?: THistoryCategoryValues[];
}

export interface IGetHistoryList {
  botId: string;
  category?: THistoryCategoryValues | null;
  year?: string;
  pageNo?: number;
  countPerPage?: number;
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

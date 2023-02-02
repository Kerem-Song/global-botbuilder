export interface IIntentListItem {
  updateUtc: string;
  intentId: string;
  intentName: string;
  flowId: string;
  flowName: string;
  nodeId: string;
  viewId: string;
  utterances?: string[];
  utteranceSummary: string;
}

export interface ISearchIntent {
  sessionToken: string;
  pageNo?: number;
  countPerPage: number;
}

export interface IGetIntent {
  sessionToken: string;
  intentId?: string;
}

export interface ISaveIntent {
  sessionToken: string;
  intentId?: string;
  intentName: string;
  utterances: string[];
  flowId?: string;
}

export interface IResponseIntentData {
  result: string;
  exception?: string;
  isSuccess?: boolean;
}

export interface IDeleteIntent {
  sessionToken: string;
  intentId: string | undefined;
}

export interface IUtteranceItem {
  isChecked?: boolean;
  intentId?: string;
  utterance: string;
}
export interface IUtteranceModel {
  id: string;
  intentId?: string;
  name: string;
  connectScenarioId: string;
  connectScenarioName?: string;
  items: IUtteranceItem[];
}

export interface IInputFormModel {
  utterance: string;
}

export interface ISearchData {
  sort: number;
  scenarios?: string | null | undefined;
  searchWord?: string | undefined;
}

export interface IScenarioData {
  scenarios: string | null | undefined;
}

export interface ICheckUtterance {
  sessionToken: string;
  utteranceId: string;
  text: string;
}

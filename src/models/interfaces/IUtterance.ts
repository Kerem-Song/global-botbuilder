import { IException, IResponse } from './IResponse';
import { IReq } from './req';
export interface IIntentListItem {
  updateUtc: string;
  intentId: string;
  intentName: string;
  flowId: string;
  flowName: string;
  nodeId: string;
  viewId: string;
  utterances?: [
    {
      text: string;
      id?: string;
    },
  ];
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

export interface ISaveIntent extends IReq {
  sessionToken?: string;
  intentId?: string;
  intentName: string;
  utterances: (string | undefined)[];
  flowId: string | null;
}

export interface IResponseIntentData {
  result: string;
  exception?: string;
  isSuccess?: boolean;
}

export interface IDeleteIntent {
  sessionToken?: string;
  intentId?: string;
}

export interface IUtteranceItem {
  isChecked?: boolean;
  intentId?: string;
  text?: string;
  id?: string;
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
  scenarios?: string | undefined;
  searchWord?: string | undefined;
}

export interface IScenarioData {
  scenarios: string | undefined;
}

export interface ICheckUtterance extends IReq {
  sessionToken: string;
  utteranceId?: string;
  text: string;
}

export interface IReactSelect {
  value: string;
  label: string;
}

export interface ICheckDuplicateIntent {
  sessionToken: string;
  intentId?: string;
  name: string;
}

export interface IResponseCheckDuplication {
  result: string;
  exception: IException;
  isSuccess: boolean;
  newToken: string;
}

export interface IResponseCheckUtteranceDuplication extends IResponse {
  result: {
    intentId: string;
    intentName: string;
    utterance: string;
    utteranceId: string;
  }[];
}

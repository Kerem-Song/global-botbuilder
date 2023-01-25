export interface IUtteranceList {
  result: [
    {
      intentId: string;
      intentName: string;
      flowId: string;
      flowName: string;
      nodeId: string;
      viewId: string;
      utterances?: string;
    },
  ];
}

export interface ISearchIntent {
  sessionToken: string;
}

export interface ISaveIntent {
  sessionToken: string;
  intentId?: string;
  intentName: string;
  utterances: [string];
  flowId?: string;
}

export interface IUtteranceDetailList {
  result: string;
  exception?: string;
  isSuccess?: boolean;
}

export type IEnterUtterance = {
  id: number;
  utterance: string;
  checked?: boolean;
};

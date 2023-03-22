export interface ISearchDeployHistory {
  pageNo: number;
  countPerPage: number;
  botId?: string;
}

export interface IResponseSearchDeployHistory {
  uid: number;
  id: string;
  no: string;
  isLive: boolean;
  snsChannel: string;
  deployedTime: string;
  actorEmail: string;
  actorName: string;
  isSuccess: boolean;
  comment?: string;
}

export interface IDeploy {
  botId: string;
  isLive: boolean;
}

export interface IUpdateDeployHistoryComment {
  comment?: string;
  deployHistoryId: string;
}

export interface IDeployResult {
  value: number;
  message: string;
}

export interface IResponseDeploy {
  exception: IException | null;
  isSuccess: boolean;
  newToken?: string | null;
}

export interface IException {
  errorCode: number;
  exceptionType: string;
  message: string;
  subErrorCode: number;
}

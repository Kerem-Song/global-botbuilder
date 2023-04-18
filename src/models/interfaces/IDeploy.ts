export interface ISearchDeployHistory {
  pageNo: number;
  countPerPage: number;
  botId?: string;
}

export interface IResponseSearchDeployHistory {
  uid: number;
  id: string;
  seq: string;
  isLive: boolean;
  snsChannel: string;
  createUtc: string;
  actorEmail: string;
  actorName: string;
  deployResult: number;
  comment?: string;
  no: string;
  isSuccess: boolean;
  createAt: string;
  createAtByBrand: string;
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
  exceptionType: string;
  errorCode: number;
  subErrorCode: number;
  message: string;
}

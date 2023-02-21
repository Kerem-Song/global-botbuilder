export interface FlowDeleteException {
  errorCode: number;
  exceptionType: string;
  message: string;
  subErrorCode: number;
  linkInfos: { currentFlowAlias: string }[];
}

export interface IResponse {
  exception: string | null;
  isSuccess: boolean;
  newToken?: string | null;
}

export interface IException {
  exceptionType: string;
  errorCode: number;
  subErrorCode: number;
  message: string;
}

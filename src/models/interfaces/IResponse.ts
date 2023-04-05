export interface IResponse {
  exception: string | IException | null;
  isSuccess: boolean;
  newToken?: string | null;
}

export interface IException {
  exceptionType: string;
  errorCode: number;
  subErrorCode: number;
  message: string;
  invalidateProperties?: string[];
}

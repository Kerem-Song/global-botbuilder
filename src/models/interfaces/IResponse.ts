export interface IResponse {
  exception: string | null;
  isSuccess: boolean;
  newToken?: string | null;
}

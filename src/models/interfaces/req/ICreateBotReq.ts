import { IReq, SnsKind } from '@models';

export interface ICreateBotReq extends IReq {
  brandId: string;
  botName: string;
  snsKind: SnsKind;
}

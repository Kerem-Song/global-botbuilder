import { SnsKind } from '@models';

export interface ISearchBotReq {
  brandId: string;
  activated?: boolean;
  snsKind?: SnsKind;
}

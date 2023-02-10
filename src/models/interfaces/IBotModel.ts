import { SnsKind } from '@models';

export interface IBotModel {
  id?: string;
  botName: string;
  snsKind: SnsKind;
  activated: boolean;
  lastDeployUTC?: string;
  lastDeployUTCTime?: string;
  prodChannel?: string;
  testChannel?: string;
}

export interface IBotInput {
  brandId: string;
  botName: string;
  snsKind: SnsKind;
}

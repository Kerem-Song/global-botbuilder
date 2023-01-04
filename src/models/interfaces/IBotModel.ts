import { SnsKind } from '@models';

export interface IBotModel {
  id?: string;
  botName: string;
  snsKind: SnsKind;
  prodChannel?: string;
  testChannel?: string;
  updateDate?: Date;
}

export interface IBotInput {
  brandId: string;
  botName: string;
  snsKind: SnsKind;
}

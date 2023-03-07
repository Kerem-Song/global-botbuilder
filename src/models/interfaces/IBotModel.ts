import { SnsKind } from '@models';

export interface IBotModel {
  id: string;
  botName: string;
  snsKind: SnsKind;
  activated: boolean;
  lastDeployUTC?: string;
  lastDeployUTCTime?: string;
  createUTC?: string;
  createUTCTime?: string;
  updateUTC?: string;
  updateUTCTime?: string;
  channelInfos?: IChannelInfo[];
  prodChannel?: string;
  testChannel?: string;
  removeCancelExpireUtc?: string;
}

export interface IChannelInfo {
  id: string;
  activated: boolean;
  name: string;
  isLive: boolean;
  isLinked: boolean;
}

export interface IBotInput {
  brandId: string;
  botName: string;
  snsKind: SnsKind;
}

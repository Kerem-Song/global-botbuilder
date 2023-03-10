import { SnsKind } from '@models';

export interface IBotModel {
  id: string;
  botName: string;
  snsKind: SnsKind;
  activated: boolean;
  lastDeployUTCTime?: string;
  updateUTC?: string;
  lastUpdateUTC?: string;
  channelInfos?: IChannelInfo[];
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

import { SnsKind } from '@models';

export interface IBotModel {
  id: string;
  botName: string;
  snsKind: SnsKind;
  activated: boolean;
  iconUrl?: string;
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

export interface IBotSettingModel {
  channelInfos: [
    {
      isLinked: boolean;
      name: string;
      isLive: boolean;
      id: string;
      linkable: boolean;
    },
    {
      isLinked: boolean;
      name: string;
      isLive: boolean;
      id: string;
      linkable: boolean;
    },
  ];
  botName: string;
  snsKind: number;
  activated: boolean;
  iconUrl?: string;
  updateUtc?: string;
  lastUpdateUTC?: string;
  isBotChannelActivatable: boolean;
  alreadyActivatedBotName: string;
  removeCancelExpire?: string;
  removeCancelExpireUtc?: string;
  id: string;
}

export interface IBotSetting {
  botId: string;
  botName: string;
}

export interface IUpdateBotActivate {
  isActivate: boolean;
  botId: string;
}

export interface IUpdateChannelActivate {
  isActivate: boolean;
  isLive: boolean;
  botId: string;
}

export interface IImportFlowGroup {
  botId: string;
  file: File;
}

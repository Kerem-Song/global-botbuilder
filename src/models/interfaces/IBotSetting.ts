import { IReq } from './req';

export interface IBotSetting {
  botId: string;
  botName: string;
}

export interface IUpdateBotActivate extends IReq {
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

export interface IUploadImage {
  file: File;
  sessionToken: string;
  ctrlId: string;
}

export interface IUpdateBotIcon {
  iconUrl: string | null;
  botId: string;
}

export interface IResponseUpdateBotIcon {
  exception: {
    errorCode: number;
    exceptionType: string;
  };
  isSuccess: boolean;
  newToken: string;
  role: number;
  staffType: number;
  result: boolean;
}

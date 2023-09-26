import { StaffType } from '@models';

import { IReq } from './req';

export interface IBotSetting extends IReq {
  botId?: string;
  botName?: string;
}

export interface IUpdateBotActivate extends IReq {
  botId: string;
  isActivate: boolean;
}

export interface IUpdateChannelActivate extends IUpdateBotActivate, IReq {
  isLive: boolean;
}

export interface IImportFlowGroup extends IReq {
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
  role: number;
  staffType: StaffType;
}

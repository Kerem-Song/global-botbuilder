import { IReq } from './IReq';

export interface ISaveBotReq extends IReq {
  botId: string;
  botName?: string;
}

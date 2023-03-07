export interface ISaveBotReq {
  botId: string;
  botName?: string;
  botActivate?: boolean;
  liveChannelLinked?: boolean;
  testChannelLinked?: boolean;
  importFlowGroupFile?: string;
}

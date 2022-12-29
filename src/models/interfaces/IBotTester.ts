import { IMessageType } from '@components/pages/scenario/BotTester/BotTester';

import { IQuickReplies } from './../../components/pages/scenario/BotTester/BotTester';

export interface IBotTester {
  bot?: {
    snsKind?: number;
    botId?: string;
  };
  user?: {
    userId?: string;
  };
  meta?: {
    replyToken?: string;
    callbackUrl?: string;
    snsRequestTimeUtc: string;
    queueInTimeUtc: string;
  };
  messages?: IMessageType[];
  quickReplies?: IQuickReplies[];
}

export interface ISendMessage {
  bot?: {
    snsKind?: number;
    botId?: string;
  };
  user?: {
    userId?: string;
  };
  meta?: {
    replyToken?: string;
    callbackUrl?: string;
    snsRequestTimeUtc: string;
    queueInTimeUtc: string;
  };
  message: {
    id: string;
    utterance: {
      value: string;
    };
  };
}

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

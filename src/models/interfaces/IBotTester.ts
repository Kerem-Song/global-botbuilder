import { IMessageItem } from '@components/pages/scenario/BotTester/BotTester';

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
  messages?: IMessageItem[];
  quickReplies?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        command?: string;
        displayText?: string;
        lunaNodeLink?: string;
      };
    },
  ];
}

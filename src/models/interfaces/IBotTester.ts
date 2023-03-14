export interface IBotTester {
  result?: {
    bot?: {
      snsKind?: number;
      botId?: string;
      botName?: string;
    };
    user?: {
      userId?: string;
      userName?: string;
      userKey?: string;
    };
    meta?: {
      isDebug?: boolean;
      replyToken?: string;
      callbackUrl?: string;
      replyUserId?: string;
      snsRequestTimeUtc?: string;
      queueInTimeUtc?: string;
    };
    messages?: ITesterDataType[];
    quickReplies?: ITesterQuickReply[];
  };
  exception?: string;
  isSuccess?: boolean;
  newToken?: string;
}

// mutation
export interface ISendMessage {
  sessionToken: string;
  lunaMessage: {
    id: string;
    utterance?: {
      value: string;
    };
    postback?: {
      queryString: string;
    };
  };
}

export interface ITesterQuickReply {
  actionType: string;
  label: string;
  postback: {
    webLinkUrl?: string;
    command?: string;
    displayText?: string;
    text?: string;
    lunaNodeLink?: string;
  };
}

export interface ITesterCard {
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
  };
  icon: {
    url: string;
  };
  title: string;
  contentText?: string;
  description: string;
  price?: {
    retail?: number;
    sale?: number;
    symbol?: string;
    discount?: number;
  };
  buttons: ITesterQuickReply[];
  type?: string;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface ITesterDebugMeta {
  nodeId?: string;
  nodeAlias?: string;
  nodeType?: string;
  flowId?: string;
  flowAlias?: string;
}

export interface IHasDebugMeta {
  debugMeta?: ITesterDebugMeta;
}

export const TESTER_DATA_TYPES = {
  text: 'text',
  productCardCarousel: 'productCardCarousel',
  cardCarousel: 'cardCarousel',
  card: 'card',
  productCard: 'productCard',
  image: 'image',
  quickReplies: 'quickReplies',
  listCard: 'listCard',
  listCardCarousel: 'listCardCarousel',
} as const;

export type ITesterDataType =
  | ITextCard
  | IProductCardCarousel
  | ICardCarousel
  | IContentTextCard
  | IProductCard
  | IImageCard
  | IListCard
  | IListCardCarousel
  | IQuickRepliesContent;

export interface ITextCard extends IHasDebugMeta {
  value?: string;
  isMe?: boolean;
  type: typeof TESTER_DATA_TYPES.text;
  defaultAction?: string;
}

export interface IProductCardCarousel extends IHasDebugMeta {
  contents: ITesterCard[];
  type: typeof TESTER_DATA_TYPES.productCardCarousel;
}

export interface ICardCarousel extends IHasDebugMeta {
  contents: ITesterCard[];
  type: typeof TESTER_DATA_TYPES.cardCarousel;
}

export interface IContentTextCard extends IHasDebugMeta {
  contentText?: string;
  title?: string;
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
    defaultAction?: {
      actionType?: string;
      label?: string;
      postback?: {
        webLinkUrl?: string;
      };
    };
  };
  buttons: ITesterQuickReply[];
  type: typeof TESTER_DATA_TYPES.card;
}

export interface IProductCard extends IHasDebugMeta {
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
  };
  icon: {
    url: string;
  };
  title: string;
  description: string;
  price?: {
    retail?: number;
    sale?: number;
    symbol?: string;
    discount?: number;
  };
  buttons: ITesterQuickReply[];
  type: typeof TESTER_DATA_TYPES.productCard;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface IImageCard extends IHasDebugMeta {
  imageUrl: string;
  imageAspectRatio: 0;
  imageSize: 0;
  background: string;
  previewUrl: string;
  type: typeof TESTER_DATA_TYPES.image;
  defaultAction: {
    actionType: string;
    label: string;
    postback: {
      webLinkUrl: string;
    };
  };
}

export interface IListCard extends IHasDebugMeta {
  header?: string;
  items: [
    {
      title: string;
      description: string;
      image?: {
        imageUrl?: string;
        imageAspectRatio?: number;
        imageSize?: number;
        background?: string;
        previewUrl?: string;
        type?: string;
      };
      postbackAction?: string;
    },
  ];
  buttons: ITesterQuickReply[];
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
  };
  type: typeof TESTER_DATA_TYPES.listCard;
}
export interface IListCardCarousel extends IHasDebugMeta {
  header?: string;
  contents: IListCard[];
  type: typeof TESTER_DATA_TYPES.listCardCarousel;
}

export interface IQuickRepliesContent {
  quickReplies: ITesterQuickReply[];
  type: typeof TESTER_DATA_TYPES.quickReplies;
}

export interface IRefreshBotTester {
  sessionToken: string;
}

export interface IResponseRefreshBotTester {
  result: boolean;
  exception: null;
  isSuccess: boolean;
  newToken: null;
}

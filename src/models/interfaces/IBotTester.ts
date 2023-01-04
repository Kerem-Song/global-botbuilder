// get
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
  messages?: IDataType[];
  quickReplies?: IQuickReply[];
}

// mutation
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
    postback?: {
      queryString: string;
    };
  };
}

export interface ITest {
  messages?: IDataType[];
  quickReplies?: IDataType[];
}

export const DATA_TYPES = {
  text: 'text',
  productCardCarousel: 'productCardCarousel',
  cardCarousel: 'cardCarousel',
  card: 'card',
  productCard: 'productCard',
  image: 'image',
  quickReplies: 'quickReplies',
} as const;

export type IDataType =
  | ITextCard
  | IProductCardCarousel
  | ICardCarousel
  | IContentTextCard
  | IProductCard
  | IImageCard
  | IQuickRepliesContent;

// productCard(Carousel)
export interface ICarousel {
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
    gross?: number;
    net?: number;
    symbol?: string;
    discount?: number;
  };
  buttons?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        lunaNodeLink?: string;
        webLinkUrl?: string;
        text?: string;
      };
    },
  ];
  type?: string;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface ITextCard {
  value?: string;
  isMe?: boolean;
  type: typeof DATA_TYPES.text;
}
export interface IProductCardCarousel {
  contents: ICarousel[];
  type: typeof DATA_TYPES.productCardCarousel;
}
export interface ICardCarousel {
  contents: ICarousel[];
  type: typeof DATA_TYPES.cardCarousel;
}

export interface IContentTextCard {
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
  buttons?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        webLinkUrl?: string;
      };
    },
    {
      actionType?: string;
      label?: string;
      postback?: {
        text?: string;
      };
    },
    {
      actionType?: string;
      label?: string;
      postback?: {
        p1?: string;
        p2?: string;
        p3?: string;
        displayText?: string;
      };
    },
  ];
  type: typeof DATA_TYPES.card;
}

export interface IProductCard {
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
    gross?: number;
    net?: number;
    symbol?: string;
    discount?: number;
  };
  buttons?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        lunaNodeLink?: string;
        webLinkUrl?: string;
        text?: string;
      };
    },
  ];
  type: typeof DATA_TYPES.productCard;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface IImageCard {
  imageUrl: string;
  imageAspectRatio: 0;
  imageSize: 0;
  background: string;
  previewUrl: string;
  type: typeof DATA_TYPES.image;
  defaultAction: {
    actionType: string;
    label: string;
    postback: {
      webLinkUrl: string;
    };
  };
}

export interface IQuickRepliesContent {
  quickReplies: IQuickReply[];
  type: typeof DATA_TYPES.quickReplies;
}
export interface IQuickReply {
  actionType?: string;
  label: string;
  postback?: {
    command?: string;
    displayText?: string;
    text?: string;
    lunaNodeLink?: string;
  };
}

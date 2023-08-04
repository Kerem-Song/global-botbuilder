export interface ITesterMeta {
  endGetBotRunnerUTC: string;
  endCreateResponseUTC: string;
  endLunaRequestUTC: string;
  runnerOption: number;
  replyToken: string;
  callbackUrl: string;
  replyUserId: string;
  snsRequestTimeUtc: string;
  queueInTimeUtc: string;
  snsKind: number;
  snsBotId: string;
  snsBotName: string;
  snsUserId: string;
  snsUserName: string;
  kakaoUserId: string;
  lunaBrandId: string;
  channelName: string;
  lunaBotId: string;
  lunaIsLiveChannel: boolean;
  isConsult: boolean;
  isPush: boolean;
  flowGroupId: string;
  channelStatus: number;
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
  | IBasicCard
  | IBasicCardCarousel
  | IListTypeCard
  | IListTypeCardCarousel
  | IProductCard
  | IProductCardCarousel
  | IQuickRepliesContent;

export interface ITesterButton {
  actionType: string;
  label: string;
  postback: {
    lunaNodeLink?: string;
    webLinkUrl?: string;
    actValueIsUttr?: string;
    lblIsUttr?: string;
    label?: string;
    command?: string;
    displayText?: string;
    text?: string;
    ctrlId?: string;
    runnerOption?: string;
  };
}

export interface IBotTester {
  meta?: ITesterMeta;
  messages?: ITesterDataType[];
  quickReplies?: ITesterButton[];
}

// mutation
export interface ISendMessage {
  sessionToken?: string;
  lunaMessage: {
    id: string;
    utterance?: {
      value?: string;
    };
    postback?: Record<string, unknown> | undefined;
    lunaNode?: {
      value?: string;
    };
  };
}

export interface ITesterImage {
  imageAspectRatio?: number;
  imageUrl?: string;
  previewUrl?: string;
}

export interface ITesterCardContents {
  title?: string;
  image?: ITesterImage;
  description?: string;
}

export interface ITesterPrice {
  retail: number;
  sale: number;
  discount: number;
  symbol: string;
  priceDisplayType: number;
  cultureInfo: string;
  retailDisplay: string;
  mainDisplay: string;
  saleDiplay: string;
  discountDisplay: string;
  isShowDiscount: boolean;
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

export interface ITesterDebugInfos {
  current_node_id: string;
  current_node_type: string;
  last_answer_node_id: string;
  last_utterance: string;
  consult_mode: string;
  reply_token: string;
  callback_url: string;
  tester_brand_id: string;
  access_token: string;
  answer_try_count: string;
}

export interface ITextCard extends IHasDebugMeta {
  value?: string;
  isMe?: boolean;
  type: typeof TESTER_DATA_TYPES.text;
}

export interface IBasicCard extends ITesterCardContents, IHasDebugMeta {
  contentText?: string;
  buttons?: ITesterButton[];
  debugMeta?: ITesterDebugMeta;
  type: typeof TESTER_DATA_TYPES.card;
}

export interface IBasicCardCarousel extends IHasDebugMeta {
  header?: string;
  contents: IBasicCard[];
  type: typeof TESTER_DATA_TYPES.cardCarousel;
}

export interface IListTypeCard extends IHasDebugMeta {
  header?: string;
  items: ITesterCardContents[];
  buttons: ITesterButton[];
  image?: ITesterImage;
  debugMeta?: ITesterDebugMeta;
  type: typeof TESTER_DATA_TYPES.listCard;
}
export interface IListTypeCardCarousel extends IHasDebugMeta {
  header?: string;
  contents: IListTypeCard[];
  type: typeof TESTER_DATA_TYPES.listCardCarousel;
}

export interface IProductCard extends ITesterCardContents, IHasDebugMeta {
  icon: {
    url: string;
  };
  price?: ITesterPrice;
  buttons: ITesterButton[];
  type: typeof TESTER_DATA_TYPES.productCard;
}

export interface IProductCardCarousel extends IHasDebugMeta {
  header?: string;
  contents: IProductCard[];
  type: typeof TESTER_DATA_TYPES.productCardCarousel;
}

export interface IQuickRepliesContent {
  quickReplies: ITesterButton[];
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

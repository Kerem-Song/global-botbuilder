export interface IThumbnailType {
  imageUrl: string;
  link?: OsLinkType;
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}

export type OsLinkType = {
  mobile?: string;
  ios?: string;
  android?: string;
  pc?: string;
  mac?: string;
  win?: string;
  web?: string;
};

export type TCardType =
  | 'text'
  | 'image'
  | 'buttonTemplate'
  | 'list'
  | 'commerce'
  | 'imgCarousel'
  | 'listCarousel'
  | 'commerceCarousel'
  | 'quickReply'
  | 'condition';

export type TDefaultCard =
  | 'Text'
  | 'Image'
  | 'Button Template'
  | 'List'
  | 'Commerce'
  | 'Image Carousel'
  | 'List Carousel'
  | 'Commerce Carousel'
  | 'Quick Reply'
  | 'Condition'
  | 'Count';

export interface IBotBuilderCardType {
  cardType: TCardType;
}
export interface IButtonType {
  label: string;
  action:
    | 'webLink'
    | 'message'
    | 'block'
    | 'phone'
    | 'operator'
    | 'osLink'
    | 'addChannel';
  webLinkUrl?: string;
  messageText?: string;
  blockId?: string;
  osLink?: OsLinkType;
  phoneNumber?: string;
  extra?: Record<string, any>;
}

export interface Profile {
  brandName: string;
  imageUrl?: string;
}

export interface IBasicCard {
  title?: string;
  description?: string;
  thumbnail?: IThumbnailType;
  buttons?: IButtonType[];
}

export interface ICommerceCard {
  productName: string;
  price: number;
  currency: string;
  discount?: number;
  discountRate?: number;
  discountPrice?: number;
  thumbnail: IThumbnailType;
  profile: Profile;
  buttons?: IButtonType[];
}

export interface IListCard {
  header: {
    title: string;
  };
  thumbnail?: IThumbnailType;
  items: {
    thumbnail?: IThumbnailType;
    title: string;
    description?: string;
    action?: 'block' | 'message';
    blockId?: string;
    messageText?: string;
    extra?: Map<string, any>;
    link?: 'pc' | 'mobile' | 'web';
  }[];
  buttons?: IButtonType[];
}

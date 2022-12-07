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
  | 'carousel'
  | 'listCarousel'
  | 'commerceCarousel'
  | 'condition';

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
  nickname: string;
  imageUrl?: string;
}

export interface IBasicCard {
  title?: string;
  description?: string;
  thumbnail?: IThumbnailType;
  buttons?: IButtonType[];
}

export interface ICommerceCard {
  description: string;
  price: number;
  currency: string;
  discount?: number;
  discountRate?: number;
  discountPrice?: number;
  thumbnail: IThumbnailType;
  profile: Profile;
  buttons: IButtonType[];
}

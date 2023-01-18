import { IButtonType, ISortableListItem, IThumbnailType, Profile } from './ICard';

export interface INodeEditModel {
  id: string;
  caption: string;
  title: string;
  view:
    | ITextViewModel
    | IBasicCardViewModel
    | IListCardViewModel
    | IProductCardViewModel
    | IAnswerViewModel;
}

export interface ITextViewModel {
  text?: string;
}

export interface IBasicCardViewModel {
  title?: string;
  description?: string;
  buttons?: IButtonType[];
}

export interface IListCardViewModel {
  header?: {
    title?: string;
  };
  items?: ISortableListItem[];
  buttons?: IButtonType[];
}

export interface IProductCardViewModel {
  productName?: string;
  price?: number;
  currency?: string;
  discount?: number;
  discountRate?: number;
  discountPrice?: number;
  thumbnail?: IThumbnailType;
  profile?: Profile;
  buttons?: IButtonType[];
}

export interface IAnswerViewModel {
  allowRes: boolean;
  extra?: Record<string, any>;
  label?: string;
  action?: 'message' | 'block';
}

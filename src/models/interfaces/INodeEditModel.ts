import { IButtonType, ISortableListItem, IThumbnailType, Profile } from './ICard';
import { IScenarioModel } from './IScenarioModel';

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
  allowHeadImgField: boolean;
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
  action?:
    | 'linkWebUrl'
    | 'message'
    | 'block'
    | 'phone'
    | 'operator'
    | 'osLink'
    | 'addChannel';
  connectedScenario?: IScenarioModel;
  messageText?: string;
  url?: string;
}

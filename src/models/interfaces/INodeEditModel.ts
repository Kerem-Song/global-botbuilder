import {
  IButtonType,
  ISortableListItem,
  IThumbnailType,
  Profile,
  TNodeTypes,
} from './ICard';
import { IScenarioModel } from './IScenarioModel';
import { IViewBase } from './res/IGetFlowRes';

export interface IGNodeEditModel<T extends IViewBase> {
  id: string;
  caption: string;
  title: string;
  view?: T;
}
export interface INodeEditModel {
  id: string;
  nodeType: TNodeTypes;
  caption: string;
  title: string;
  view?: IViewBase;
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

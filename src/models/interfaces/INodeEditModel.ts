import { IButtonType, ISortableListItem } from './ICard';

export interface INodeEditModel {
  id: string;
  caption: string;
  title: string;
  view: ITextViewModel | IBasicCardViewModel | IListCardViewModel;
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

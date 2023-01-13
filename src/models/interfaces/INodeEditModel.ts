import { IButtonType } from './ICard';

export interface INodeEditModel {
  id: string;
  caption: string;
  title: string;
  view: ITextViewModel | IBasicCardViewModel;
}

export interface ITextViewModel {
  text?: string;
}

export interface IBasicCardViewModel {
  title?: string;
  description?: string;
  buttons?: IButtonType[];
}

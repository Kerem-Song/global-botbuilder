export interface INodeEditModel {
  id: string;
  caption: string;
  title: string;
  view: ITextViewModel;
}

export interface ITextViewModel {
  text: string;
}

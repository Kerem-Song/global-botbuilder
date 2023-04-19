import { TNodeTypes } from './ICard';
import { IViewBase } from './res/IGetFlowRes';

export interface IGNodeEditModel<T extends IViewBase> extends INodeEditModel {
  view?: T;
}
export interface INodeEditModel {
  id: string;
  type: TNodeTypes;
  caption: string;
  title: string;
  nextNodeId?: string;
  view?: IViewBase;
  option?: number;
}

import * as yup from 'yup';

import { TNodeTypes } from './ICard';
import { ACTION_TYPES, IViewBase } from './res/IGetFlowRes';

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
}

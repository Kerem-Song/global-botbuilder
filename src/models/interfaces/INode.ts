import { ConditionJoin } from '@models/enum';
import { NodeKind } from '@models/enum/NodeKind';

import {
  IAnswerNode,
  IBasicCardNode,
  IConditionNode,
  ICountNode,
  IListCardNode,
  IOtherFlowRedirectNode,
  IProductCardNode,
  TNodeTypes,
} from './ICard';
import { IConditionItem } from './res/IGetFlowRes';

export interface INode {
  id: string;
  type: TNodeTypes;
  title?: string;
  description?: string;
  nodeKind: NodeKind;
  x: number;
  y: number;
  view?: ITextView | IConditionView;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListCardNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[]
    | IOtherFlowRedirectNode[];
}

export interface ITextView {
  text: string;
}

export interface IConditionView {
  items: IConditionItem[];
  join?: ConditionJoin;
}

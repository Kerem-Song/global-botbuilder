import { ConditionJoin } from '@models/enum';
import { NodeKind } from '@models/enum/NodeKind';

import {
  IAnswerNode,
  IBasicCardNode,
  IConditionNode,
  ICountNode,
  IListNode,
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
    | IListNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[];
}

export interface ITextView {
  text: string;
}

export interface IConditionView {
  items: IConditionItem[];
  join?: ConditionJoin;
}

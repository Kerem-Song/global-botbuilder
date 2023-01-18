import { ConditionJoin } from '@models/enum';
import { NodeKind } from '@models/enum/NodeKind';

import {
  IAnswerNode,
  IBasicCardNode,
  IConditionNode,
  ICountNode,
  IListNode,
  IOtherFlowRedirectNode,
  IProductCardNode,
  TNodeTypes,
} from './ICard';
import { IConditionItem, IViewBase } from './res/IGetFlowRes';

export interface INode {
  id: string;
  type: TNodeTypes;
  title?: string;
  description?: string;
  nodeKind: NodeKind;
  x: number;
  y: number;
  view?: IViewBase;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[]
    | IOtherFlowRedirectNode[];
}

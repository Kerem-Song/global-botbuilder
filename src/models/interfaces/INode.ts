import { NodeKind } from '@models/enum/NodeKind';

import {
  IAnswerNode,
  IBasicCardNode,
  IConditionNode,
  IListCardNode,
  IOtherFlowRedirectNode,
  IProductCardNode,
  IRetryConditionNode,
  NODE_TYPES,
  TNodeTypes,
} from './ICard';
import { IIntentNode, IViewBase } from './res/IGetFlowRes';

export interface INode {
  id: string;
  type: TNodeTypes;
  title?: string;
  description?: string;
  nodeKind: NodeKind;
  option: number;
  seq: number;
  x: number;
  y: number;
  view?: IViewBase;
  nextNodeId?: string;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListCardNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | IRetryConditionNode[]
    | IOtherFlowRedirectNode[];
}

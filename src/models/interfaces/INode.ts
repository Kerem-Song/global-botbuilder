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

export interface INode {
  id: string;
  type: TNodeTypes;
  title?: string;
  description?: string;
  nodeKind: NodeKind;
  x: number;
  y: number;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[];
}

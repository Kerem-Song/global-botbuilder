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

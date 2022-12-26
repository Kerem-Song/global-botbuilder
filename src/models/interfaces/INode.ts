import {
  IBasicCard,
  ICommerceCard,
  ICondition,
  ICount,
  IListCard,
  IQuickReply,
  TDefaultCard,
} from './ICard';

export interface INode {
  id: string;
  type: TDefaultCard;
  title?: string;
  x: number;
  y: number;
  cards?:
    | IBasicCard[]
    | ICommerceCard[]
    | IListCard[]
    | IQuickReply[]
    | ICondition[]
    | ICount[];
}

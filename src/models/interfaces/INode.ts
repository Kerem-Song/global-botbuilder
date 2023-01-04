import {
  IBasicCard,
  ICommerceCard,
  ICondition,
  ICount,
  IListCard,
  IQuickReply,
  TCardsValues,
} from './ICard';

export interface INode {
  id: string;
  type: TCardsValues;
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

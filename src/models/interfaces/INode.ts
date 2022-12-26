import { ICondition, ICount, IListCard } from 'src/models/interfaces/ICard';

import { IBasicCard, ICommerceCard, IQuickReply } from './ICard';

export interface INode {
  id: string;
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

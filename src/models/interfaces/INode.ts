import { IBasicCard, ICommerceCard } from './ICard';

export interface INode {
  id: string;
  title?: string;
  x: number;
  y: number;
  cards?: IBasicCard[] | ICommerceCard[];
}

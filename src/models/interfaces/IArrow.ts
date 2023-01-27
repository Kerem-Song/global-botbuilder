import { ArrowType } from '@models/types';

export interface IArrow {
  start: string;
  end: string;
  type: ArrowType;
  updateKey?: string;
  isNextNode?: boolean;
}

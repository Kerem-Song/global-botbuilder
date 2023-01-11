export interface IArrow {
  start: string;
  end: string;
  type: 'blue' | 'green' | 'red' | 'yellow';
  updateKey?: string;
  isNextNode?: boolean;
}

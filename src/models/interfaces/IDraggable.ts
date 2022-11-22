import { MutableRefObject } from 'react';

export interface ICanvasValue {
  x: number;
  y: number;
  scale: number;
}

export interface IDraggable {
  id: string;
  title: string;
  description: string;
  buttons: { buttonId: string; name: string; endPoint: string }[];
  deleteCard?: (id: string) => void;
  cardRef?: MutableRefObject<(HTMLDivElement | null)[]>;
}

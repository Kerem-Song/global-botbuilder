export type TButtons = {
  buttonId: string;
  name: string;
  endPoint: string;
};

export type TPoint = {
  x: number;
  y: number;
};

export type TPosition = {
  start?: TPoint;
};

export type IEndPosition = {
  end?: TPoint;
};

export type TOffset =
  | 0
  | {
      x: number;
      y: number;
    }[];

import React from 'react';
import { FC } from 'react';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';

export interface TitleProps extends IHasChildren {
  level?: 1 | 2 | 3 | 4 | 5;
}

export const Title: FC<TitleProps> = ({ children, level = 1 }) => {
  return React.createElement(`h${level}`, {}, children);
};

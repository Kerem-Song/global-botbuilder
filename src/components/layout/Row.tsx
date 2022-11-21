import { FC } from 'react';
import { IHasChildren } from '../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';

export interface RowProps extends IHasChildren, IHasClassNameNStyle {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  align?: 'flex-start' | 'flex-end' | 'center' | 'strech';
}
export const Row: FC<RowProps> = ({ justify, align, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: justify,
        alignItems: align,
      }}
    >
      {children}
    </div>
  );
};

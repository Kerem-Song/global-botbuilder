import { FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';

export interface RowProps extends IHasChildren, IHasClassNameNStyle {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  align?: 'flex-start' | 'flex-end' | 'center' | 'strech';
  gap?: number;
}
export const Row: FC<RowProps> = ({
  justify,
  align,
  children,
  gap: gutter,
  style,
  className,
}) => {
  const styleResult = {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: justify,
    alignItems: align,
    gap: gutter ? `0 ${gutter}px` : undefined,
    ...style,
  };

  return (
    <div style={styleResult} className={className}>
      {children}
    </div>
  );
};

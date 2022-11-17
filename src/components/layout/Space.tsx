import classNames from 'classnames';
import { FC } from 'react';
import { SizeType } from 'src/models/types/SizeType';

import { IHasChildren } from '../../models/interfaces/IHasChildren';
import { DirectionType } from '../../models/types/DirectionType';

export interface ISpaceProp extends IHasChildren {
  direction?: DirectionType;
  gap?: SizeType | number;
}

function sizeToNumber(value: SizeType | number): number {
  switch (value) {
    case 'x-large':
      return 20;
    case 'large':
      return 10;
    case 'small':
      return 5;
    case 'x-small':
      return 2;
    case 'none':
      return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return 0;
}

export const Space: FC<ISpaceProp> = ({
  children,
  direction = 'horizontal',
  gap = 'large',
}) => {
  const className = classNames('luna-space', {
    'luna-space-vertical': direction === 'vertical',
  });

  return (
    <div className={className} style={{ gap: `${sizeToNumber(gap)}px` }}>
      {children}
    </div>
  );
};
import classNames from 'classnames';
import { FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';
import { SizeType } from '../../models/types/SizeType';

export interface CardProps extends IHasChildren, IHasClassNameNStyle {
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  radius?: SizeType;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  style,
  title,
  bordered = true,
  hoverable,
  radius,
}) => {
  const wrapClass = classNames(className, 'luna-card', {
    'luna-card-bordered': bordered,
    'luna-card-hoverable': hoverable,
    [`border-radius-${radius}`]: radius !== undefined,
  });

  const titleClass = classNames('luna-card-head');

  const bodyClass = classNames('luna-card-body');
  return (
    <div className={wrapClass} style={style}>
      {title ? <div className={titleClass}>{title}</div> : undefined}
      {children ? <div className={bodyClass}>{children}</div> : undefined}
    </div>
  );
};

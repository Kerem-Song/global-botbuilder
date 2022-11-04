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
  onClick?: () => void;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  style,
  title,
  bordered = true,
  hoverable,
  radius = 'none',
  onClick,
}) => {
  const wrapClass = classNames(className, 'luna-card', {
    'luna-card-bordered': bordered,
    'luna-card-hoverable': hoverable,
    [`border-radius-${radius}`]: radius !== 'none',
  });

  const titleClass = classNames('luna-card-head');

  const bodyClass = classNames('luna-card-body');
  return (
    <div
      className={wrapClass}
      style={style}
      onClick={() => {
        onClick?.();
      }}
    >
      {title ? <div className={titleClass}>{title}</div> : undefined}
      {children ? <div className={bodyClass}>{children}</div> : undefined}
    </div>
  );
};

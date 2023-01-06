import classNames from 'classnames';
import { CSSProperties, FC, useEffect } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';
import { SizeType } from '../../models/types/SizeType';

export interface CardProps extends IHasChildren, IHasClassNameNStyle {
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  radius?: SizeType;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  onClick?: () => void;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  bodyClassName,
  titleClassName,
  style,
  bodyStyle,
  titleStyle,
  title,
  bordered = true,
  hoverable,
  radius = 'none',
  onClick,
}) => {
  const wrapClass = classNames(
    'luna-card',
    {
      'luna-card-bordered': bordered,
      'luna-card-hoverable': hoverable,
      [`border-radius-${radius}`]: radius !== 'none',
    },
    className,
  );

  const titleClass = classNames('luna-card-head', titleClassName);

  const bodyClass = classNames('luna-card-body', bodyClassName);

  return (
    <div
      className={wrapClass}
      style={style}
      onClick={() => {
        onClick?.();
      }}
      role="presentation"
    >
      {title ? (
        <div className={titleClass} style={titleStyle}>
          {title}
        </div>
      ) : undefined}
      {children ? (
        <div className={bodyClass} style={bodyStyle}>
          {children}
        </div>
      ) : undefined}
    </div>
  );
};

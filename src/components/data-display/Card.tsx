import { IHasChildren, IHasClassNameNStyle, SizeType } from '@models';
import classNames from 'classnames';
import { CSSProperties, FC } from 'react';

export interface ICardProps extends IHasChildren, IHasClassNameNStyle {
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

export const Card: FC<ICardProps> = ({
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

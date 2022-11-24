import * as classNames from 'classnames';
import { createElement, FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

export type ButtonShape = 'default' | 'circle' | 'round' | 'ghost';

export interface ButtonProps extends IHasChildren {
  type?: 'default' | 'primary' | 'secondary';
  small?: boolean;
  shape?: ButtonShape;
  block?: boolean;
  label?: string;
  disabled?: boolean;
  href?: string;
  htmlType?: string;
  icon?: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  type = 'default',
  small,
  block,
  children,
  label,
  disabled,
  href,
  htmlType = 'button',
  onClick,
  shape = 'default',
  icon,
}) => {
  if (children && label) {
    throw new Error('children과 label은 동시에 설정할 수 없다.');
  }

  const labelNode = <span>{label || children}</span>;

  const controlCss = classNames('luna-btn', {
    'luna-btn-disabled': disabled,
    'luna-btn-block': block,
    'luna-btn-circle': shape === 'circle',
    'luna-btn-primary': type === 'primary',
    'luna-btn-secondary': type === 'secondary',
    'luna-btn-small': small,
    'luna-btn-ghost': shape === 'ghost',
  });

  const iconNode = icon ? (
    <span role="img" className="icon">
      <img src={icon} alt="icon" />
    </span>
  ) : undefined;

  const control = createElement(
    href ? 'a' : 'button',
    {
      className: controlCss,
      disabled: disabled && !href,
      href: href,
      onClick,
      type: htmlType,
    },
    iconNode,
    labelNode,
  );

  return control;
};

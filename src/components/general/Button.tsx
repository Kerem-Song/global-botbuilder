import * as classNames from 'classnames';
import { createElement, FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

export type ButtonShape = 'default' | 'circle' | 'round';

export interface ButtonProps extends IHasChildren {
  type?: 'default' | 'primary' | 'secondary';
  shape?: ButtonShape;
  block?: boolean;
  label?: string;
  disabled?: boolean;
  href?: string;
  htmlType?: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  type,
  block,
  children,
  label,
  disabled,
  href,
  htmlType = 'button',
  onClick,
  shape = 'default',
}) => {
  if (children && label) {
    throw new Error('children과 label은 동시에 설정할 수 없다.');
  }

  const buttonLabel = <span>{label || children}</span>;

  const controlCss = classNames('luna-btn', {
    'luna-btn-disabled': disabled,
    'luna-btn-block': block,
    'luna-btn-circle': shape === 'circle',
    'luna-btn-primary': type === 'primary',
    'luna-btn-secondary': type === 'secondary',
  });

  const control = createElement(
    href ? 'a' : 'button',
    {
      className: controlCss,
      disabled: disabled && !href,
      href: href,
      onClick,
      type: htmlType,
    },
    buttonLabel,
  );

  return control;
};

import * as classNames from 'classnames';
import { createElement, FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

export type ButtonShape = 'default' | 'circle' | 'round';

export interface ButtonProps extends IHasChildren {
  shape?: ButtonShape;
  block?: boolean;
  label?: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  block,
  children,
  label,
  disabled,
  href,
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
  });

  const control = createElement(
    href ? 'a' : 'button',
    { className: controlCss, disabled: disabled && !href, href: href, onClick },
    buttonLabel,
  );

  return control;
};

import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, { createElement, FC } from 'react';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

export type ButtonShape = 'default' | 'circle' | 'round' | 'ghost';

export interface ButtonProps extends IHasChildren, IHasClassNameNStyle {
  type?: 'default' | 'primary' | 'secondary';
  small?: boolean;
  shape?: ButtonShape;
  block?: boolean;
  label?: string;
  disabled?: boolean;
  href?: string;
  htmlType?: string;
  icon?: string;
  value?: string;
  draggable?: boolean;
  data?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDrag?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onPointerDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
  shape = 'default',
  icon,
  style,
  className,
  value,
  draggable,
  data,
  onClick,
  onDrag,
  onDragStart,
  onDrop,
  onDragEnd,
  onPointerDown,
}) => {
  if (children && label) {
    throw new Error('children과 label은 동시에 설정할 수 없다.');
  }

  const labelNode = <span>{label || children}</span>;

  const controlCss = classNames(
    'luna-btn',
    {
      'luna-btn-disabled': disabled,
      'luna-btn-block': block,
      'luna-btn-circle': shape === 'circle',
      'luna-btn-primary': type === 'primary',
      'luna-btn-secondary': type === 'secondary',
      'luna-btn-small': small,
      'luna-btn-ghost': shape === 'ghost',
    },
    className,
  );

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
      type: htmlType,
      style: style,
      value,
      draggable,
      data,
      onClick,
      onDrag,
      onDragStart,
      onDrop,
      onDragEnd,
      onPointerDown,
    },
    iconNode,
    labelNode,
  );

  return control;
};

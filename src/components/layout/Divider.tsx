import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import { FC } from 'react';

export const Divider: FC<IHasClassNameNStyle> = ({ style, className }) => {
  const cssNames = classNames(className, 'luna-divider', 'luna-divider-horizontal');
  return <div className={cssNames} style={style}></div>;
};

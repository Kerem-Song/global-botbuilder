import classNames from 'classnames';
import { FC } from 'react';

export const Divider: FC = () => {
  const className = classNames('luna-divider', 'luna-divider-horizontal');
  return <div className={className}></div>;
};

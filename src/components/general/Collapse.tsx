import { IHasChildren, IHasClassNameNStyle } from '@models';
import { Dispatch, FC, SetStateAction, useState } from 'react';

interface CollapseProps extends IHasChildren, IHasClassNameNStyle {}

export const Collapse: FC<CollapseProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className="collapseWrapper"
      onClick={handleCollapse}
      role="presentation"
      data-collapsed={isCollapsed}
    >
      {children}
    </div>
  );
};

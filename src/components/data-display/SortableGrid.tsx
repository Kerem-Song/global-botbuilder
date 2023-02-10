import { IHasChildren } from '@models';
import { ReactNode } from 'react';

interface ISortableGrid extends IHasChildren {
  columns: number;
}

export const SoratbleGrid = ({ children, columns }: ISortableGrid) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: 8,
        paddingBottom: 12,
      }}
    >
      {children}
    </div>
  );
};

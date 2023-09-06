import { IHasChildren, IHasClassNameNStyle } from '@models';
import { FC, useEffect, useRef } from 'react';

export interface RowProps extends IHasChildren, IHasClassNameNStyle {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  align?: 'flex-start' | 'flex-end' | 'center' | 'strech';
  gap?: number;
}
export const Row: FC<RowProps> = ({
  justify,
  align,
  children,
  gap,
  style,
  className,
}) => {
  const padding = gap === undefined ? '0' : `-${gap / 2}px`;

  const styleResult = {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: justify,
    alignItems: align,
    margin: padding,
    ...style,
  };

  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gap !== undefined) {
      if (rowRef.current) {
        const children = rowRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = rowRef.current.children[i] as HTMLDivElement;
          child.style.padding = `${gap / 2}px`;
        }
      }
    } else {
      if (rowRef.current) {
        const children = rowRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = rowRef.current.children[i] as HTMLDivElement;
          child.style.padding = '0';
        }
      }
    }
  }, [gap, children]);

  return (
    <div style={styleResult} className={className} ref={rowRef}>
      {children}
    </div>
  );
};

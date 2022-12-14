import { FC, ReactNode, useEffect, useState } from 'react';

export interface CarouselProps {
  children: ReactNode[];
}

export const Carousel: FC<CarouselProps> = ({ children }) => {
  const [current, setCurrent] = useState(0);

  const prev = current === 0 ? children.length - 1 : current - 1;
  const [style, setStyle] = useState({
    marginLeft: `${current * -190}px`,
    transition: 'none',
  });

  useEffect(() => {
    setStyle({ marginLeft: `${current * -190}px`, transition: 'all 0.3s ease-out' });
  }, [current]);

  return (
    <div
      role="presentation"
      style={{ width: '190px', overflowX: 'hidden' }}
      onClick={() => {
        setCurrent(current === children.length - 1 ? 0 : current + 1);
      }}
    >
      <div style={{ display: 'flex', ...style }}>
        {children.map((c, i) => {
          return (
            <div style={{ width: '190px', flex: 'none' }} key={i}>
              {i === current ? c : <div style={{ width: '190px', flex: 'none' }}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

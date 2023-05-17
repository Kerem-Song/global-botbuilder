import { IHasChildren } from '@models';
import { Placement } from '@popperjs/core';
import { FC, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

export interface ITooltipProps extends IHasChildren {
  tooltip: string;
  placement?: Placement;
  disable?: boolean;
  offset?: [number, number];
}
export const Tooltip: FC<ITooltipProps> = ({
  children,
  tooltip,
  disable,
  placement,
  offset,
}) => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);

  const { styles, attributes, update } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: placement,
      modifiers: [{ name: 'offset', options: { offset } }],
      strategy: 'fixed',
    },
  );

  const handlePopper = () => {
    update?.();
    setShowPopper(true);
  };

  const handleLazyHide = () => {
    setShowPopper(false);
  };

  if (disable) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className="popper"
        ref={referenceElement}
        role="presentation"
        onMouseLeave={handleLazyHide}
        onMouseEnter={handlePopper}
      >
        {children}
      </div>
      <div
        className="luna-tooltip-wrap"
        ref={popperElement}
        style={{ ...styles.popper, visibility: showPopper ? 'visible' : 'hidden' }}
        {...attributes.popper}
      >
        <div className="luna-tooltip">{tooltip}</div>
      </div>
    </>
  );
};

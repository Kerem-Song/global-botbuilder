import { IHasChildren } from '@models';
import { Placement } from '@popperjs/core';
import { FC, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

export interface ITooltipProps extends IHasChildren {
  tooltip: string;
  placement?: Placement;
}
export const Tooltip: FC<ITooltipProps> = ({ children, tooltip, placement }) => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);

  const { styles, attributes, update } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: placement,
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

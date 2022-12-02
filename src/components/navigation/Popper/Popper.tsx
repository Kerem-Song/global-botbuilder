import { IHasChildren, IHasClassNameNStyle } from '@models/interfaces';
import { Placement } from '@popperjs/core';
import classNames from 'classnames';
import { FC, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { PopperListItem } from './PopperListItem';

export interface IPopperItem {
  id: string;
  name: string;
  showBullet?: boolean;
  type?: ItemType;
  icon?: string;
}

export type ItemType = 'button' | 'icon-front';

export interface IPopperProps extends IHasChildren, IHasClassNameNStyle {
  placement?: Placement;
  popperItems: IPopperItem[];
  showBullet?: boolean;
  onChange?: (item: IPopperItem) => void;
  popup?: boolean;
  popupList?: boolean;
  offset?: [number, number];
}

export const Popper: FC<IPopperProps> = ({
  className,
  placement = 'right-start',
  children,
  popup,
  popupList,
  showBullet,
  popperItems,
  offset,
  onChange,
}) => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: placement,
      modifiers: [{ name: 'offset', options: { offset } }],
    },
  );

  const handleSelect = (item: IPopperItem) => {
    setShowPopper(false);
    onChange?.(item);
  };

  const handlePopper = () => {
    setShowPopper(!showPopper);
  };

  const outsideClickRef = useRef<HTMLDivElement>(null);
  useOutsideClick(outsideClickRef, () => {
    if (showPopper) {
      handlePopper();
    }
  });

  const handleMouseOver = () => {
    outsideClickRef.current?.setAttribute('data-mouse-over', 'true');
  };

  const handleLazyHide = () => {
    outsideClickRef.current?.removeAttribute('data-mouse-over');
    setTimeout(() => {
      if (!outsideClickRef.current?.hasAttribute('data-mouse-over')) {
        setShowPopper(false);
      }
    }, 100);
  };

  const popperContainer = classNames(className, 'luna-chatbot-container', {
    'luna-popup-container': popup,
  });

  return (
    <div ref={outsideClickRef}>
      <div
        style={{ display: 'inline' }}
        ref={referenceElement}
        role="presentation"
        onClick={() => {
          handlePopper();
        }}
        onMouseLeave={handleLazyHide}
        onMouseEnter={handleMouseOver}
      >
        {children}
      </div>
      <div
        className={popperContainer}
        ref={popperElement}
        style={{ ...styles.popper, visibility: showPopper ? 'visible' : 'hidden' }}
        onMouseLeave={handleLazyHide}
        onMouseEnter={handleMouseOver}
        {...attributes.popper}
      >
        {popperItems?.map((item) => (
          <PopperListItem
            key={item.id}
            item={item}
            showBullet={showBullet}
            popupList={popupList}
            handleSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

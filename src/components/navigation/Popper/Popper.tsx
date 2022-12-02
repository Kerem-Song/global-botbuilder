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
  popperItems?: IPopperItem[];
  showBullet?: boolean;
  popup?: boolean;
  popupList?: boolean;
  offset?: [number, number];
}

const Item: IPopperItem[] = [
  {
    id: '1',
    name: 'Rename',
  },
  {
    id: '2',
    name: 'Delete',
  },
];

export const Popper: FC<IPopperProps> = ({
  className,
  placement = 'right-start',
  children,
  popup,
  popupList,
  showBullet,
  popperItems = Item,
  offset,
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
    outsideClickRef.current?.setAttribute('mouse-over', 'true');
  };

  const handleLazyHide = () => {
    outsideClickRef.current?.removeAttribute('mouse-over');
    setTimeout(() => {
      if (!outsideClickRef.current?.hasAttribute('mouse-over')) {
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
            handlePopper={handlePopper}
          />
        ))}
      </div>
    </div>
  );
};

import { Input } from '@components/data-entry';
import { IHasChildren, IHasClassNameNStyle } from '@models/interfaces';
import { Placement } from '@popperjs/core';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { usePopper } from 'react-popper';

import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { PopperListItem } from './PopperListItem';
import { PopperSelectItem } from './PopperSelectItem';

export interface IPopperItem<T> {
  id: string;
  name: string;
  type?: ItemType;
  icon?: string;
  data?: T;
}

export interface IPopperSelectItem<T> {
  id: string;
  name: string;
  select?: string;
  showBullet?: boolean;
  type?: ISelectType;
  icon?: string;
  data?: T;
}

export type ItemType = 'button' | 'icon-front' | 'search';
export type ISelectType = 'button';
export interface IPopperProps<T> extends IHasChildren, IHasClassNameNStyle {
  placement?: Placement;
  popperItems?: IPopperItem<T>[];
  popperSelect?: IPopperSelectItem<T>[];
  showBullet?: boolean;
  onChange?: (item: IPopperItem<T> | IPopperSelectItem<T>) => void;
  selectedItem?: IPopperItem<T>;
  popup?: boolean;
  popupList?: boolean;
  offset?: [number, number];
}

export const Popper = <T extends object>({
  className,
  placement = 'right-start',
  children,
  popup,
  popupList,
  showBullet,
  popperItems,
  popperSelect,
  offset,
  onChange,
}: IPopperProps<T>) => {
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

  const handleSelect = (item: IPopperItem<T> | IPopperSelectItem<T>) => {
    setShowPopper(false);
    onChange?.(item);
  };

  const handlePopper = () => {
    update?.();
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
    }, 1000);
  };

  const popperContainer = classNames(className, 'luna-chatbot-container', {
    'luna-popup-container': popup,
  });

  const [items, setItems] = useState(popperItems);
  const [userInput, setUserInput] = useState<string | null>('');

  const onSearch = (data: string) => {
    const input = data.toLowerCase();

    const filtered = popperItems?.filter((item) =>
      item.name.toLowerCase().includes(input),
    );

    setItems(filtered);
    setUserInput(input);

    if (!data) {
      setItems(popperItems);
    }
  };

  return (
    <div ref={outsideClickRef}>
      <div
        className="popper"
        ref={referenceElement}
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
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
        {popperItems?.some((item) => item.type === 'search') ? (
          <>
            <Input
              placeholder="Input search text"
              search
              onSearch={(data) => onSearch(data as string)}
              onChange={(e) => setUserInput(e.currentTarget.value)}
              value={userInput || ''}
            />
          </>
        ) : null}

        {items?.map((item: IPopperItem<T>) => (
          <PopperListItem
            key={item.id}
            item={item}
            popupList={popupList}
            handleSelect={handleSelect}
          />
        ))}
        {popperSelect?.map((item: IPopperSelectItem<T>) => (
          <PopperSelectItem
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

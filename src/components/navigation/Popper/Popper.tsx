import { Input } from '@components/data-entry';
import { useOutsideClick } from '@hooks';
import { IHasChildren, IHasClassNameNStyle } from '@models/interfaces';
import { Placement } from '@popperjs/core';
import classNames from 'classnames';
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { usePopper } from 'react-popper';

import { PopperListItem } from './PopperListItem';
import { PopperSelectItem } from './PopperSelectItem';

export interface IPopperItem<T> {
  id: string;
  name: string;
  brandname?: string;
  account?: string;
  children?: ReactNode | React.ReactNode[];
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

export type ItemType =
  | 'button'
  | 'icon-front'
  | 'search'
  | 'children'
  | 'disable'
  | 'normal';

export type ISelectType = 'button';
export interface IPopperProps<T> extends IHasChildren, IHasClassNameNStyle {
  placement?: Placement;
  popperItems?: IPopperItem<T>[];
  popperSelect?: IPopperSelectItem<T>[];
  showBullet?: boolean;
  onChange?: (item: IPopperItem<T> | IPopperSelectItem<T>) => void;
  selectedId?: string;
  popup?: boolean;
  popupList?: boolean;
  logoutBtn?: boolean;
  offset?: [number, number];
  disabled?: boolean;
  positions?: { x: number; y: number };
}

export const Popper = <T extends object>({
  className,
  placement = 'right-start',
  children,
  popup,
  popupList,
  popperItems,
  popperSelect,
  offset,
  disabled,
  onChange,
  selectedId,
  positions,
}: IPopperProps<T>) => {
  const [selected, setSelected] = useState<string>();
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const { t } = useTranslation('scenario'.toUpperCase());
  const { styles, attributes, update } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: placement,
      modifiers: [{ name: 'offset', options: { offset } }],
      strategy: 'fixed',
    },
  );

  const popperStyle: CSSProperties = {
    ...styles.popper,
    visibility: showPopper ? 'visible' : 'hidden',
    transform:
      (positions && className === 'onContextMenu') ||
      (positions && className === 'contextMenuBtn')
        ? `translate(${positions.x}px, ${positions.y}px)`
        : styles.popper.transform,
    top:
      (positions && className === 'onContextMenu') ||
      (positions && className === 'contextMenuBtn')
        ? 0
        : styles.popper.top,
    left:
      (positions && className === 'onContextMenu') ||
      (positions && className === 'contextMenuBtn')
        ? 0
        : styles.popper.left,
    right:
      (positions && className === 'onContextMenu') ||
      (positions && className === 'contextMenuBtn')
        ? 'auto'
        : styles.popper.right,
    bottom:
      (positions && className === 'onContextMenu') ||
      (positions && className === 'contextMenuBtn')
        ? 'auto'
        : styles.popper.bottom,
  };

  const handleSelect = (item: IPopperItem<T> | IPopperSelectItem<T>) => {
    setShowPopper(false);
    setSelected(item.id);
    onChange?.(item);
  };

  const handlePopper = () => {
    if (
      (!popperItems || popperItems.length === 0) &&
      (!items || items.length === 0) &&
      (!popperSelect || popperSelect.length === 0)
    ) {
      return;
    } else if (disabled) {
      return;
    }
    update?.();
    setShowPopper(!showPopper);
  };

  const outsideClickRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    outsideClickRef,
    () => {
      if (showPopper) {
        handlePopper();
      }
    },
    className === 'otherFlowRedirectNodeList',
  );

  const handleMouseOver = () => {
    outsideClickRef.current?.setAttribute('data-mouse-over', 'true');
  };

  const handleLazyHide = () => {
    if (className === 'otherFlowRedirectNodeList') {
      return;
    }
    outsideClickRef.current?.removeAttribute('data-mouse-over');
    setTimeout(() => {
      if (!outsideClickRef.current?.hasAttribute('data-mouse-over')) {
        setShowPopper(false);
      }
    }, 200);
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

  useEffect(() => {
    if (popperSelect) {
      setSelected(selectedId);
    }
  }, [popperSelect]);

  useEffect(() => {
    setItems(popperItems);

    // 메모리 관리
    return () => {
      setItems([]);
    };
  }, [i18n.language, popperItems]);

  return (
    <div ref={outsideClickRef}>
      <div
        className="popper"
        ref={referenceElement}
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
          if (className === 'onContextMenu') {
            return;
          } else {
            handlePopper();
          }
        }}
        onMouseLeave={handleLazyHide}
        onMouseEnter={handleMouseOver}
        onContextMenu={(e) => {
          e.stopPropagation();
          if (className === 'onContextMenu') {
            handlePopper();
          }
        }}
      >
        {children}
      </div>
      {ReactDOM.createPortal(
        <div
          role="presentation"
          className={popperContainer}
          ref={popperElement}
          style={popperStyle}
          onMouseLeave={handleLazyHide}
          onMouseEnter={handleMouseOver}
          onMouseDown={(e) => {
            // e.preventDefault();
            e.stopPropagation();
          }}
          {...attributes.popper}
        >
          {popperItems?.some((item) => item.type === 'search') ? (
            <>
              <Input
                id={'scenarioListPopupInput'}
                placeholder={t(`INPUT_SEARCH_WORD`)}
                search
                onSearch={(data) => {
                  onSearch(data as string);
                }}
                onChange={(e) => {
                  setUserInput(e.currentTarget.value);
                }}
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
              className={classNames({ disable: item.type === 'disable' })}
            />
          ))}
          {popperSelect?.map((item: IPopperSelectItem<T>) => (
            <PopperSelectItem
              key={item.id}
              item={item}
              popupList={popupList}
              handleSelect={handleSelect}
              checked={item.id === selected}
            />
          ))}
        </div>,
        document.querySelector('body')!,
      )}
    </div>
  );
};

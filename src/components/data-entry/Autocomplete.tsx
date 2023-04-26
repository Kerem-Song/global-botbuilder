import { util } from '@modules/util';
import classNames from 'classnames';
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

import { Input } from './Input';

export interface AutocompleteProps<T extends object> {
  items?: T[];
  defaultValue?: T;
  displayName?: keyof T;
  valuePath?: keyof T;
  isDisabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  prefix?: ReactNode;
  sufix?: ReactNode;
  create?: (value: string | undefined) => T | undefined;
  onChange?: (value: T | undefined) => void;
  error?: any;
}

export const Autocomplete = <T extends object>(args: AutocompleteProps<T>) => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const referenceElement = useRef<HTMLInputElement | null>(null);
  const popperElement = useRef<HTMLDivElement>(null);
  const [focusedItem, setFocusedItem] = useState<T>();

  const { items, displayName } = args;

  useEffect(() => {
    if (args.defaultValue) {
      if (displayName) {
        setSearch(`${args.defaultValue[displayName]}`);
      } else {
        setSearch(`${args.defaultValue}`);
      }
    } else {
      setSearch('');
    }
  }, [args.defaultValue]);
  const { styles, attributes, update } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: 'bottom',
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }],
      strategy: 'fixed',
    },
  );

  const handleShowPopper = () => {
    setShowPopper(true);
    update?.();
  };

  const handleHidePopper = () => {
    setFocusedItem(undefined);
    setShowPopper(false);
  };

  const handleSearchChange = (value: string) => {
    handleShowPopper();
    setFocusedItem(undefined);
    setSearch(value);
    args.onChange?.(
      items?.find((x) => (displayName ? x[displayName] : `${x}`) === value) ||
        args.create?.(value),
    );
  };

  const filteredList = items?.filter((x) => {
    if (!search) {
      return true;
    }
    const value = displayName ? `${x[displayName]}` : `${x}`;
    return value.startsWith(search);
  });

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!filteredList?.length) {
        return;
      }

      if (!showPopper) {
        handleShowPopper();
        return;
      }

      const index = focusedItem
        ? Math.min(filteredList.indexOf(focusedItem) + 1, filteredList.length - 1)
        : 0;
      setFocusedItem(filteredList[index]);
    } else if (e.key === 'ArrowUp') {
      if (!filteredList?.length) {
        return;
      }

      const index = focusedItem ? Math.max(filteredList.indexOf(focusedItem) - 1, 0) : 0;
      setFocusedItem(filteredList[index]);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={referenceElement}>
        <Input
          className={classNames('luna-input', { 'luna-input-error': args.error })}
          onFocus={() => handleShowPopper()}
          onBlur={() => handleHidePopper()}
          onKeydown={handleInputKeydown}
          prefix={args.prefix}
          sufix={args.sufix}
          readOnly={args.readOnly}
          disabled={args.isDisabled}
          placeholder={args.placeholder}
          onPressEnter={() => {
            if (showPopper) {
              if (focusedItem) {
                const value = displayName
                  ? `${focusedItem[displayName]}`
                  : `${focusedItem}`;
                handleSearchChange(value);
              }
              handleHidePopper();
            } else {
              handleShowPopper();
            }
          }}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div
        className="luna-popup-container"
        ref={popperElement}
        style={{
          ...styles.popper,
          width: referenceElement.current?.clientWidth,
          maxHeight: '400px',
          overflowY: 'auto',
          display:
            showPopper && filteredList && filteredList.length > 0 ? 'block' : 'none',
        }}
        {...attributes.popper}
      >
        {filteredList?.map((item: T, index: number) => {
          const display = displayName ? `${item[displayName]}` : `${item}`;
          const focused = item === focusedItem;
          const itemClassName = classNames('luna-popup-list', {
            'luna-popup-list-focused': focused,
          });
          return (
            <div
              role="presentation"
              key={index}
              className={itemClassName}
              style={{ width: '100%' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (referenceElement.current) {
                  const value = displayName ? `${item[displayName]}` : `${item}`;
                  handleSearchChange(value);
                }
              }}
            >
              <span>{util.replaceKeywordMark(display, search, true)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// export const Autocomplete = forwardRef(AutocompleteComp) as <T extends object>(
//   props: AutocompleteProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> },
// ) => ReturnType<typeof AutocompleteComp>;

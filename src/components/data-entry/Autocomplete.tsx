import { IDataEntryProp } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { util } from '@modules/util';
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

import { Input } from './Input';

export interface AutocompleteProps<T extends object> {
  items?: T[];
  defaultValue?: T;
  displayName?: keyof T;
  valuePath?: keyof T;
  create?: (value: string | undefined) => T | undefined;
  onChange?: (value: T | undefined) => void;
}

export const Autocomplete = <T extends object>(args: AutocompleteProps<T>) => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const referenceElement = useRef<HTMLInputElement | null>(null);
  const popperElement = useRef<HTMLDivElement>(null);

  const { items, displayName } = args;

  useEffect(() => {
    if (args.defaultValue) {
      if (displayName) {
        console.log('args.defaultValue', args.defaultValue);
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

  const handleSearchChange = (value: string) => {
    setShowPopper(true);
    setSearch(value);
    args.onChange?.(
      items?.find((x) => (displayName ? x[displayName] : `${x}`) === value) ||
        args.create?.(value),
    );
    update?.();
  };

  const filteredList = items?.filter((x) => {
    if (!search) {
      return true;
    }
    const value = displayName ? `${x[displayName]}` : `${x}`;
    return value.startsWith(search);
  });

  return (
    <div style={{ position: 'relative' }}>
      <div ref={referenceElement}>
        <Input
          onFocus={() => {
            setShowPopper(true);
            update?.();
          }}
          onBlur={(e) => {
            setShowPopper(false);
          }}
          onPressEnter={() => setShowPopper(false)}
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
          display:
            showPopper && filteredList && filteredList.length > 0 ? 'block' : 'none',
        }}
        {...attributes.popper}
      >
        {filteredList?.map((item: T, index: number) => {
          const display = displayName ? `${item[displayName]}` : `${item}`;
          return (
            <div
              role="presentation"
              key={index}
              className="luna-popup-list"
              style={{ width: '100%' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (referenceElement.current) {
                  const value = displayName ? `${item[displayName]}` : `${item}`;
                  handleSearchChange(value);
                  //util.TriggerInputOnChange(referenceElement.current, value);
                }
              }}
            >
              <span>{util.replaceKeywordMark(display, `^${search}`)}</span>
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

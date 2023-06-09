import { Button } from '@components/general';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { IHasClassNameNStyle, SizeType } from '@models';
import { util } from '@modules/util';
import classNames from 'classnames';
import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputProps extends IDataEntryProp, IHasClassNameNStyle {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  size?: SizeType;
  search?: boolean;
  clearable?: boolean;
  isShawAlwaysClear?: boolean;
  readOnly?: boolean;
  prefix?: ReactNode;
  sufix?: ReactNode;
  onPressEnter?: (value: string | undefined) => void;
  onSearch?: (value: string | undefined) => void;
  onPressEsc?: () => void;
  onKeydown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onChangeCount?: (count: number) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [textLength, setTextLength] = useState<number>(args.value?.length || 0);
  const {
    showCount,
    isError,
    required,
    size,
    search,
    onSearch,
    onPressEnter,
    onPressEsc,
    onClear,
    onChangeCount,
    onKeydown,
    className,
    clearable,
    isShawAlwaysClear,
    readOnly,
    prefix,
    sufix,
    ...inputProps
  } = args;

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    onKeydown?.(e);

    switch (e.key) {
      case 'Enter':
        onPressEnter?.(inputRef.current?.value);
        onSearch?.(inputRef.current?.value);
        if (onPressEnter || onSearch) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
      case 'Escape':
        onPressEsc?.();
        if (onPressEsc) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
    }
  };
  const isWrapping = false || showCount || search || clearable || prefix || sufix;

  const inputClassName = classNames(isWrapping ? '' : className, 'luna-input', {
    'luna-input-error': isError,
    'luna-input-large': size === 'large',
    'luna-input-normal': size === 'normal',
  });
  const inputWrapClassName = classNames(isWrapping ? className : '', 'luna-input-wrap', {
    'luna-input-error': isError,
    'luna-input-large': size === 'large',
    'luna-input-small': size === 'small',
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    args.onChange?.(e);
    setTextLength(e.target.value?.length || 0);
  };

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    args.onBlur?.(e);
    onSearch?.(e.target.value);
  };

  useEffect(() => {
    onChangeCount?.(textLength);
  }, [textLength]);

  useEffect(() => {
    setTextLength(args.value?.length || 0);
  }, [args.value]);

  useEffect(() => {
    setTextLength(inputRef.current?.value.length || 0);
  }, [inputRef.current?.value]);

  const input = (
    <input
      className={inputClassName}
      {...inputProps}
      onKeyDown={
        args.onPressEnter || args.onSearch || onKeydown ? handleKeyUp : undefined
      }
      ref={(current) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(current);
          } else {
            ref.current = current;
          }
        }
        inputRef.current = current;
      }}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      aria-invalid={isError}
      aria-required={required}
      readOnly={readOnly}
      title={inputRef.current?.value}
    />
  );
  if (isWrapping) {
    return (
      <span className={inputWrapClassName}>
        {prefix}
        {input}
        {showCount ? (
          <span className="count">
            <>
              {textLength}
              {args.maxLength ? `/${args.maxLength}` : undefined}
            </>
          </span>
        ) : undefined}
        {search ? (
          <Button
            small
            shape="ghost"
            className="input-button"
            onClick={() => {
              util.TriggerInputOnChange(inputRef.current, '');
              setTextLength(0);
              onSearch?.('');
            }}
          >
            <div className={classNames('search', { clear: textLength })} />
          </Button>
        ) : undefined}
        {clearable && (isShawAlwaysClear || textLength) && !search ? (
          <Button
            small
            shape="ghost"
            className="input-button"
            onClick={(e) => {
              util.TriggerInputOnChange(inputRef.current, '');
              setTextLength(0);
              onClear?.();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="clear" />
          </Button>
        ) : undefined}
        {sufix}
      </span>
    );
  }

  return input;
});

Input.displayName = 'luna_input';

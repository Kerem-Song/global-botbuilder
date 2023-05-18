import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import { MouseEvent, useRef } from 'react';

import { IPopperItem } from './Popper';

export interface IPopperLitsItem<T> extends IHasClassNameNStyle {
  item: IPopperItem<T>;
  popupList?: boolean;
  handleSelect?: (item: IPopperItem<T>) => void;
}

export const PopperListItem = <T extends object>({
  className,
  item,
  popupList,
  handleSelect,
}: IPopperLitsItem<T>) => {
  const radioRef = useRef<HTMLInputElement>(null);
  const popperList = classNames(className, 'luna-chatbot-list', {
    'luna-popup-list': popupList,
  });

  const handleCheckChange = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();
    if (radioRef.current) {
      radioRef.current.checked = true;
    }
    handleSelect?.(item);
  };

  const itemType = () => {
    switch (item.type) {
      case 'button':
        return (
          <button className="list-view-btn" onClick={handleCheckChange}>
            {item.name}
          </button>
        );
      case 'icon-front': {
        return (
          <div className={popperList} role="presentation" onClick={handleCheckChange}>
            <img src={item.icon} alt="icon" />
            <div className="items-name">{item.name}</div>
          </div>
        );
      }
      case 'children': {
        return <>{item.children}</>;
      }
      default:
        return (
          <div className={popperList} role="presentation" onClick={handleCheckChange}>
            <div className="items-name">{item.name}</div>
          </div>
        );
    }
  };

  return <>{itemType ? <div>{itemType()}</div> : null}</>;
};

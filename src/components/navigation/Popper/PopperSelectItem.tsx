import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';

import { IPopperSelectItem } from './Popper';

export interface IPopperSelectListItem<T> extends IHasClassNameNStyle {
  item: IPopperSelectItem<T>;
  popupList?: boolean;
  handleSelect?: (item: IPopperSelectItem<T>) => void;
  checked?: boolean;
}

export const PopperSelectItem = <T extends object>({
  className,
  item,
  popupList,
  handleSelect,
  checked,
}: IPopperSelectListItem<T>) => {
  const popperList = classNames(className, 'luna-chatbot-list', {
    'luna-popup-list': popupList,
  });

  const handleCheckChange = () => {
    handleSelect?.(item);
  };

  const itemType = () => {
    switch (item.type) {
      case 'button':
        return (
          <button className="list-view-btn" onClick={() => handleCheckChange()}>
            {item.name}
          </button>
        );
      default:
        return (
          <div
            className={popperList}
            role="presentation"
            onClick={() => handleCheckChange()}
          >
            <div
              className={classNames('items-name', {
                'checked-items-name': checked,
              })}
              role="presentation"
            >
              {item.name}
            </div>
            {item.icon && <img className="social-icon" src={item.icon} alt="icon" />}
          </div>
        );
    }
  };
  return <div>{itemType ? <div>{itemType()}</div> : null}</div>;
};

import { Radio } from '@components/data-entry';
import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, { FC } from 'react';

import { IPopperItem } from './Popper';

export interface IPopperListItem extends IHasClassNameNStyle {
  item: IPopperItem;
  showBullet?: boolean;
  popupList?: boolean;
  handlePopper?: () => void;
}

export const PopperListItem: FC<IPopperListItem> = ({
  className,
  item,
  showBullet,
  popupList,
  handlePopper,
}) => {
  const popperList = classNames(className, 'luna-chatbot-list', {
    'luna-popup-list': popupList,
  });

  const itemType = () => {
    switch (item.type) {
      case 'button':
        return (
          <button className="list-view-btn" onClick={handlePopper}>
            {item.name}
          </button>
        );
      case 'icon-front': {
        return (
          <div className={popperList}>
            {item.icon && <img src={item.icon} alt="icon" />}
            <div className="items-name" role="presentation" onClick={handlePopper}>
              {item.name}
            </div>
          </div>
        );
      }
      default:
        return (
          <div className={popperList}>
            {showBullet && <Radio />}
            <div className="items-name" role="presentation" onClick={handlePopper}>
              {item.name}
            </div>
            {item.icon && <img className="social-icon" src={item.icon} alt="icon" />}
          </div>
        );
    }
  };

  return <>{itemType ? <div>{itemType()}</div> : null}</>;
};

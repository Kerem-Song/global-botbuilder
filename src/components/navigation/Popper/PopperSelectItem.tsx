import { Radio } from '@components/data-entry/Radio';
import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, { useRef } from 'react';

import useI18n from '../../../hooks/useI18n';
import { IPopperSelectItem } from './Popper';

export interface IPopperSelectListItem<T> extends IHasClassNameNStyle {
  item: IPopperSelectItem<T>;
  showBullet?: boolean;
  popupList?: boolean;
  handleSelect?: (item: IPopperSelectItem<T>) => void;
}

export const PopperSelectItem = <T extends object>({
  className,
  item,
  showBullet,
  popupList,
  handleSelect,
}: IPopperSelectListItem<T>) => {
  const { i18n } = useI18n();
  const language = i18n.language;

  const radioRef = useRef<HTMLInputElement>(null);
  const popperList = classNames(className, 'luna-chatbot-list', {
    'luna-popup-list': popupList,
  });

  const handleCheckChange = () => {
    if (radioRef.current) {
      radioRef.current.checked = true;
    }
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
            {showBullet && <Radio ref={radioRef} />}
            <div
              className="items-name"
              role="presentation"
              style={language === item.id ? { fontWeight: '900' } : { fontWeight: '400' }}
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
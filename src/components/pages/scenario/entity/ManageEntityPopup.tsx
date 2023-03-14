import { icPopupClose } from '@assets';
import { usePage } from '@hooks';
import { useState } from 'react';
import { FC } from 'react';
import ReactModal from 'react-modal';

import { MyEntity } from './MyEntity';
import { SystemEntity } from './SystemEntity';

export interface ManageEntitiyPopupProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const ManageEntityPopup: FC<ManageEntitiyPopupProps> = ({
  isOpen,
  handleIsOpen,
}) => {
  const [activeIndex, setAcitveIndex] = useState<number>(0);
  const { t, tc } = usePage();
  const handleClose = () => {
    handleIsOpen(false);
  };
  const tabClickedHandler = (index: number) => {
    setAcitveIndex(index);
  };

  const tabArr = [
    {
      tabTitle: 'MY_ENTITY',
      tabCont: <MyEntity />,
    },
    {
      tabTitle: 'SYSTEM_ENTITY',
      tabCont: <SystemEntity />,
    },
  ];

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal"
      isOpen={isOpen}
    >
      <div className="header">
        <ul className="title">
          {tabArr.map((x, i) => {
            return (
              <li
                key={i}
                role="presentation"
                className={activeIndex === i ? 'is-active' : ''}
                onClick={() => tabClickedHandler(i)}
              >
                {t(x.tabTitle)}
              </li>
            );
          })}
        </ul>
        <button className="closeBtn" onClick={handleClose}>
          <img src={icPopupClose} alt="delete"></img>
        </button>
      </div>
      <div className="myEntitiesContainer">
        <div className="entitiesWrapper">{tabArr[activeIndex].tabCont}</div>
      </div>
    </ReactModal>
  );
};

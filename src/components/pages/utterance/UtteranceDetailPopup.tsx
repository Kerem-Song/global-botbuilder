import { FC } from 'react';
import ReactModal from 'react-modal';

import { UtteranceDetail } from './UtteranceDetail';

export interface IUtteranceDetailPopupProps {
  isOpenUtteranceDetailPopup: boolean;
  handleIsOpenUtteranceDetailPopup: (value: boolean) => void;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}

export const UtteranceDetailPopup: FC<IUtteranceDetailPopupProps> = ({
  isOpenUtteranceDetailPopup,
  handleIsOpenUtterancePopup,
  handleIsOpenUtteranceDetailPopup,
}) => {
  const handleClose = () => {
    handleIsOpenUtterancePopup(true);
    handleIsOpenUtteranceDetailPopup(false);
  };
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal detail"
      isOpen={isOpenUtteranceDetailPopup}
      onRequestClose={handleClose}
    >
      <UtteranceDetail
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        handleIsOpenUtteranceDetailPopup={handleIsOpenUtteranceDetailPopup}
        handleClose={handleClose}
      />
    </ReactModal>
  );
};

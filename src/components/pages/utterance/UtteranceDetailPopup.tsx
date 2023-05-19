import { FC } from 'react';
import ReactModal from 'react-modal';

import { UtteranceDetail } from './UtteranceDetail';

export interface IUtteranceDetailPopupProps {
  intentId?: string;
  isOpenUtteranceDetailPopup: boolean;
  handleCloseUtteranceDetailPopup: () => void;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}

export const UtteranceDetailPopup: FC<IUtteranceDetailPopupProps> = ({
  intentId,
  isOpenUtteranceDetailPopup,
  handleIsOpenUtterancePopup,
  handleCloseUtteranceDetailPopup,
}) => {
  const handleClose = () => {
    handleIsOpenUtterancePopup(true);
    handleCloseUtteranceDetailPopup();
  };
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal detail"
      isOpen={isOpenUtteranceDetailPopup}
      onRequestClose={handleClose}
    >
      <UtteranceDetail
        intentId={intentId}
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleClose={handleClose}
      />
    </ReactModal>
  );
};

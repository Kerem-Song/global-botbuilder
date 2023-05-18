import { FC } from 'react';
import ReactModal from 'react-modal';

import { UtteranceDetail } from './UtteranceDetail';

export interface IUtteranceDetailPopupProps {
  utteranceId: string | undefined;
  isOpenUtteranceDetailPopup: boolean;
  handleCloseUtteranceDetailPopup: () => void;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}

export const UtteranceDetailPopup: FC<IUtteranceDetailPopupProps> = ({
  utteranceId,
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
        utteranceId={utteranceId}
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleClose={handleClose}
      />
    </ReactModal>
  );
};

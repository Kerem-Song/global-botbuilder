import { FC, useState } from 'react';
import ReactModal from 'react-modal';

import { IntentDetail } from './IntentDetail';

export interface IIntentDetailPopupProps {
  intentId?: string;
  isOpenUtteranceDetailPopup: boolean;
  handleCloseUtteranceDetailPopup: () => void;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}

export const IntentDetailPopup: FC<IIntentDetailPopupProps> = ({
  intentId,
  isOpenUtteranceDetailPopup,
  handleIsOpenUtterancePopup,
  handleCloseUtteranceDetailPopup,
}) => {
  const [intentKey, setIntentKey] = useState<string | undefined>(intentId);
  const handleClose = () => {
    handleCloseUtteranceDetailPopup();
  };

  return (
    <ReactModal
      overlayClassName="intentPopupOverlay node-draggable-ignore"
      className="intentPopupModal detail"
      isOpen={isOpenUtteranceDetailPopup}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
    >
      <IntentDetail
        intentId={intentKey}
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        handleClose={handleClose}
        handleSetIntentId={setIntentKey}
      />
    </ReactModal>
  );
};

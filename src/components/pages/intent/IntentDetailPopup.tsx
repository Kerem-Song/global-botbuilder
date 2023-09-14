import { usePage, useSystemModal } from '@hooks';
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
  const [isActive, setIsActive] = useState<boolean>(false);
  const [intentKey, setIntentKey] = useState<string | undefined>(intentId);
  const { confirm } = useSystemModal();
  const { tc } = usePage();

  const handleClose = async () => {
    if (isActive) {
      const closePopupConfirm = await confirm({
        title: tc('SAVE_CONFIRM_TITLE'),
        description: (
          <p style={{ whiteSpace: 'pre-line' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        ),
      });
      if (closePopupConfirm) {
        handleCloseUtteranceDetailPopup();
      }
    } else {
      handleCloseUtteranceDetailPopup();
    }
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
        isActive={isActive}
        setIsActive={setIsActive}
        intentId={intentKey}
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        handleCloseUtteranceDetailPopup={handleCloseUtteranceDetailPopup}
        handleClose={handleClose}
        handleSetIntentId={setIntentKey}
      />
    </ReactModal>
  );
};

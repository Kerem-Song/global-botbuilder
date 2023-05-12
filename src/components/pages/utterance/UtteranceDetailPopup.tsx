import { Button } from '@components/general';
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
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal detail"
      isOpen={isOpenUtteranceDetailPopup}
    >
      <Button
        onClick={() => {
          handleIsOpenUtterancePopup(true);
          handleIsOpenUtteranceDetailPopup(false);
        }}
      >
        close
      </Button>
      <UtteranceDetail
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        handleIsOpenUtteranceDetailPopup={handleIsOpenUtteranceDetailPopup}
      />
    </ReactModal>
  );
};

import { Button } from '@components/general';
import { FC } from 'react';
import ReactModal from 'react-modal';

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
    <ReactModal isOpen={isOpenUtteranceDetailPopup}>
      <Button
        onClick={() => {
          handleIsOpenUtterancePopup(true);
          handleIsOpenUtteranceDetailPopup(false);
        }}
      >
        닫자닫자
      </Button>
    </ReactModal>
  );
};

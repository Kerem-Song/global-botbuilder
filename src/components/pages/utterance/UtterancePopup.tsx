import { Button } from '@components/general';
import { FC } from 'react';
import ReactModal from 'react-modal';

export interface IUtterancePopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
  handleIsOpenUtteranceDetailPopup: (value: boolean) => void;
}

export const UtterancePopup: FC<IUtterancePopupProps> = ({
  isOpenUtterancePopup,
  handleIsOpenUtterancePopup,
  handleIsOpenUtteranceDetailPopup,
}) => {
  return (
    <ReactModal isOpen={isOpenUtterancePopup}>
      <Button
        onClick={() => {
          handleIsOpenUtterancePopup(false);
          handleIsOpenUtteranceDetailPopup(true);
        }}
      >
        열자열자
      </Button>
      <Button
        onClick={() => {
          handleIsOpenUtterancePopup(false);
        }}
      >
        아예닫자
      </Button>
    </ReactModal>
  );
};

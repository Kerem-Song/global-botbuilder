import { icPopupClose } from '@assets';
import { Button } from '@components/general';
import { usePage } from '@hooks';
import { ISearchData } from '@models';
import { Dispatch, FC, SetStateAction } from 'react';
import ReactModal from 'react-modal';

import { ToSearch } from './ToSearch';

export interface IUtterancePopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
  handleIsOpenUtteranceDetailPopup: (value: boolean) => void;
  searchData: ISearchData;
  setSearchData: Dispatch<SetStateAction<ISearchData>>;
}

export const UtterancePopup: FC<IUtterancePopupProps> = ({
  isOpenUtterancePopup,
  handleIsOpenUtterancePopup,
  handleIsOpenUtteranceDetailPopup,
  searchData,
  setSearchData,
}) => {
  const { t } = usePage();
  const handleClose = () => {
    handleIsOpenUtterancePopup(false);
  };
  const handleDetailPopupOpen = () => {
    handleIsOpenUtterancePopup(false);
    handleIsOpenUtteranceDetailPopup(true);
  };
  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="entityModal detail"
      isOpen={isOpenUtterancePopup}
      onRequestClose={handleClose}
    >
      <div className="utteranceWrap">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="title">{t('TITLE')}</div>
          <Button shape="ghost" onClick={handleClose} icon={icPopupClose} />
        </div>
        <ToSearch searchData={searchData} setSearchData={setSearchData} />
      </div>
      <Button onClick={handleDetailPopupOpen}>add</Button>
    </ReactModal>
  );
};

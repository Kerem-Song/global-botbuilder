import { icPopupClose } from '@assets';
import { Input } from '@components';
import { Button } from '@components/general';
import { usePage, useRootState } from '@hooks';
import { ISearchData } from '@models';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import ReactModal from 'react-modal';

import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export interface IUtterancePopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
  handleIsOpenUtteranceDetailPopup: (utteranceId?: string) => void;
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
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const { t } = usePage();
  const [searchWord, setSearchWord] = useState<string>('');

  const handleSearch = (keyword?: string) => {
    setSearchWord(keyword!);
  };

  const handleClose = () => {
    handleIsOpenUtterancePopup(false);
  };

  const handleDetailPopupOpen = (utteranceId?: string) => {
    handleIsOpenUtterancePopup(false);
    handleIsOpenUtteranceDetailPopup(utteranceId);
  };

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="utteranceModal"
      isOpen={isOpenUtterancePopup}
      onRequestClose={handleClose}
    >
      <div className="utteranceWrap">
        <div className="utteranceDetail">
          <div className="utteranceDetailTitle">
            {selectedScenarios?.alias}
            {/* {t('TITLE')} */}
          </div>
          <Button
            className="utteranceDetailClose"
            shape="ghost"
            onClick={handleClose}
            icon={icPopupClose}
          />
        </div>
        <div className="searchUtterance">
          <Input
            size="small"
            search
            placeholder={t('SEARCH_UTTERANCE_PLACEHOLDER')}
            value={searchWord}
            onSearch={(value) => handleSearch(value)}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="utteranceListWrap utterancePopupListWrap">
          <table className="utteranceTable">
            <thead>
              <UtteranceListHeader
                isOpenUtterancePopup={isOpenUtterancePopup}
                handleDetailPopupOpen={handleDetailPopupOpen}
              />
            </thead>
            <tbody>
              <UtteranceListItem
                searchData={searchData}
                isOpenUtterancePopup={isOpenUtterancePopup}
                handleDetailPopupOpen={handleDetailPopupOpen}
              />
            </tbody>
          </table>
        </div>
      </div>
    </ReactModal>
  );
};

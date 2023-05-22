import { icPopupClose } from '@assets';
import { Input } from '@components';
import { Button } from '@components/general';
import { useI18n, usePage, useRootState } from '@hooks';
import { ISearchData } from '@models';
import { Dispatch, FC, SetStateAction } from 'react';
import ReactModal from 'react-modal';

import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export interface IUtterancePopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
  handleIsOpenUtteranceDetailPopup: (intentId?: string) => void;
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
  const handleSearch = (keyword: string) => {
    setSearchData({
      sort: 1,
      scenarios: selectedScenarios && selectedScenarios.id,
      searchWord: keyword,
    });
  };

  const handleClose = () => {
    handleIsOpenUtterancePopup(false);
  };

  const handleDetailPopupOpen = (intentId?: string) => {
    handleIsOpenUtterancePopup(false);
    handleIsOpenUtteranceDetailPopup(intentId);
  };

  return (
    <ReactModal
      style={{ overlay: { display: 'flex' } }}
      className="utteranceModal"
      isOpen={isOpenUtterancePopup}
      onRequestClose={handleClose}
    >
      <div className="utteranceWrap" onContextMenu={(e) => e.stopPropagation()}>
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
            placeholder={t('SEARCH_INTENT_PLACEHOLDER')}
            onSearch={(value) => handleSearch(value!)}
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

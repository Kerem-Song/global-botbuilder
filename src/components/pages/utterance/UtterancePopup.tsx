import { icPopupClose } from '@assets';
import { Input } from '@components';
import { Button } from '@components/general';
import { useI18n, useRootState, useUtteranceClient } from '@hooks';
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
  const { t } = useI18n('utterance');
  const { removeUtteranceQueries } = useUtteranceClient();

  const handleSearch = (keyword: string) => {
    setSearchData({
      sort: 1,
      scenarios: selectedScenarios && selectedScenarios.id,
      searchWord: keyword || undefined,
    });
  };

  const handleClose = () => {
    handleIsOpenUtterancePopup(false);
    removeUtteranceQueries();
  };

  const handleDetailPopupOpen = (intentId?: string) => {
    handleIsOpenUtterancePopup(false);
    handleIsOpenUtteranceDetailPopup(intentId);
    removeUtteranceQueries();
  };

  return (
    <ReactModal
      overlayClassName="utterancePopupOverlay node-draggable-ignore"
      className="utteranceModal"
      isOpen={isOpenUtterancePopup}
      onRequestClose={handleClose}
    >
      <div className="utteranceWrap" onContextMenu={(e) => e.stopPropagation()}>
        <div className="utteranceDetail">
          <div className="utteranceDetailTitle">
            {selectedScenarios?.alias} {t('TITLE')}
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
            <UtteranceListHeader
              isOpenUtterancePopup={isOpenUtterancePopup}
              handleDetailPopupOpen={handleDetailPopupOpen}
            />
            <UtteranceListItem
              searchData={searchData}
              isOpenUtterancePopup={isOpenUtterancePopup}
              handleDetailPopupOpen={handleDetailPopupOpen}
            />
          </table>
        </div>
      </div>
    </ReactModal>
  );
};

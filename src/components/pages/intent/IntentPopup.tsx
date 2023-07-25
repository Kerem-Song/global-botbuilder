import { icPopupClose } from '@assets';
import { Divider, Input } from '@components';
import { Button } from '@components/general';
import { useI18n, useRootState, useUtteranceClient } from '@hooks';
import { ISearchData } from '@models';
import { Dispatch, FC, SetStateAction } from 'react';
import ReactModal from 'react-modal';
import { useDebouncedCallback } from 'use-debounce';

import { IntentListHeader } from './IntentListHeader';
import { IntentListItem } from './IntentListItem';

export interface IIntentPopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
  handleIsOpenUtteranceDetailPopup: (intentId?: string) => void;
  searchData: ISearchData;
  setSearchData: Dispatch<SetStateAction<ISearchData>>;
}

export const IntentPopup: FC<IIntentPopupProps> = ({
  isOpenUtterancePopup,
  handleIsOpenUtterancePopup,
  handleIsOpenUtteranceDetailPopup,
  searchData,
  setSearchData,
}) => {
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const { t } = useI18n('intent');
  const { removeUtteranceQueries } = useUtteranceClient();

  const handleSearch = useDebouncedCallback((keyword: string) => {
    setSearchData({
      sort: 1,
      scenarios: selectedScenarios && selectedScenarios.id,
      searchWord: keyword || undefined,
    });
    removeUtteranceQueries();
  }, 500);

  const handleClose = () => {
    handleIsOpenUtterancePopup(false);
    removeUtteranceQueries();
    setSearchData({
      sort: 1,
      scenarios: selectedScenarios && selectedScenarios.id,
      searchWord: undefined,
    });
  };

  const handleDetailPopupOpen = (intentId?: string) => {
    handleIsOpenUtterancePopup(false);
    handleIsOpenUtteranceDetailPopup(intentId);
    removeUtteranceQueries();
    setSearchData({
      sort: 1,
      scenarios: selectedScenarios && selectedScenarios.id,
      searchWord: undefined,
    });
  };

  return (
    <ReactModal
      overlayClassName="utterancePopupOverlay node-draggable-ignore"
      className="utteranceModal"
      isOpen={isOpenUtterancePopup}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
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
        <Divider />
        <div className="searchUtterance">
          <Input
            search
            placeholder={t('SEARCH_INTENT_PLACEHOLDER')}
            onSearch={(value) => handleSearch(value!)}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="utteranceListWrap utterancePopupListWrap">
          <table className="utteranceTable">
            <IntentListHeader
              isOpenUtterancePopup={isOpenUtterancePopup}
              handleDetailPopupOpen={handleDetailPopupOpen}
            />
            <IntentListItem
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

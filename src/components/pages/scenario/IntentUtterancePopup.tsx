import { useModalOpenExtra, useRootState } from '@hooks';
import { ISearchData } from '@models';
import { FC, useState } from 'react';

import { UtteranceDetailPopup } from '../utterance/UtteranceDetailPopup';
import { UtterancePopup } from '../utterance/UtterancePopup';

export interface IIntentUtterancePopupProps {
  isOpenUtterancePopup: boolean;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}

export const IntentUtterancePopup: FC<IIntentUtterancePopupProps> = ({
  isOpenUtterancePopup,
  handleIsOpenUtterancePopup,
}) => {
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const [searchData, setSearchData] = useState<ISearchData>({
    sort: 1,
    scenarios: selectedScenarios && selectedScenarios.id,
    searchWord: undefined,
  });

  const {
    extra: utteranceId,
    isOpen: isOpenUtteranceDetailPopup,
    handleOpen: handleOpenUtteranceDetailPopup,
    handleClose: handleCloseUtteranceDetailPopup,
  } = useModalOpenExtra<string | undefined>();

  const handleOpenDetailUtterancePopup = (utteranceId?: string) => {
    handleOpenUtteranceDetailPopup(utteranceId);
  };
  return (
    <>
      {isOpenUtterancePopup && (
        <UtterancePopup
          isOpenUtterancePopup={isOpenUtterancePopup}
          handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
          handleIsOpenUtteranceDetailPopup={handleOpenDetailUtterancePopup}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      )}

      {isOpenUtteranceDetailPopup && (
        <UtteranceDetailPopup
          utteranceId={utteranceId}
          isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
          handleCloseUtteranceDetailPopup={handleCloseUtteranceDetailPopup}
          handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        />
      )}
    </>
  );
};
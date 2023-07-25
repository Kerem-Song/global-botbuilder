import { useModalOpenExtra, useRootState } from '@hooks';
import { ISearchData } from '@models';
import { FC, useState } from 'react';

import { IntentDetailPopup } from '../intent/IntentDetailPopup';
import { IntentPopup } from '../intent/IntentPopup';

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
    extra: intentId,
    isOpen: isOpenUtteranceDetailPopup,
    handleOpen: handleOpenUtteranceDetailPopup,
    handleClose: handleCloseUtteranceDetailPopup,
  } = useModalOpenExtra<string | undefined>();

  const handleOpenDetailUtterancePopup = (intentId?: string) => {
    handleOpenUtteranceDetailPopup(intentId);
  };
  return (
    <>
      {isOpenUtterancePopup && (
        <IntentPopup
          isOpenUtterancePopup={isOpenUtterancePopup}
          handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
          handleIsOpenUtteranceDetailPopup={handleOpenDetailUtterancePopup}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      )}

      {isOpenUtteranceDetailPopup && (
        <IntentDetailPopup
          intentId={intentId}
          isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
          handleCloseUtteranceDetailPopup={handleCloseUtteranceDetailPopup}
          handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        />
      )}
    </>
  );
};

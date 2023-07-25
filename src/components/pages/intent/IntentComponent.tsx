import { useModalOpen, usePage } from '@hooks';
import { ISearchData } from '@models/interfaces/IUtterance';
import { useState } from 'react';

import { IntentListHeader } from './IntentListHeader';
import { IntentListItem } from './IntentListItem';
import { ToSearch } from './ToSearch';

export const IntentComponent = () => {
  const { t } = usePage();
  const [searchData, setSearchData] = useState<ISearchData>({
    sort: 1,
    scenarios: 'all',
    searchWord: undefined,
  });
  const { isOpen: isOpenUtterancePopup } = useModalOpen();

  return (
    <div className="utteranceWrap">
      <div className="title">{t('TITLE')}</div>
      <ToSearch searchData={searchData} setSearchData={setSearchData} />
      <div className="utteranceListWrap">
        <table className="utteranceTable">
          <IntentListHeader isOpenUtterancePopup={isOpenUtterancePopup} />
          <IntentListItem
            searchData={searchData}
            isOpenUtterancePopup={isOpenUtterancePopup}
          />
        </table>
      </div>
    </div>
  );
};

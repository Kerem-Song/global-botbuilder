import { useModalOpen, usePage } from '@hooks';
import { ISearchData } from '@models/interfaces/IUtterance';
import { useState } from 'react';

import { ToSearch } from './ToSearch';
import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export const UtteranceComponent = () => {
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
          <UtteranceListHeader isOpenUtterancePopup={isOpenUtterancePopup} />
          <UtteranceListItem
            searchData={searchData}
            isOpenUtterancePopup={isOpenUtterancePopup}
          />
        </table>
      </div>
    </div>
  );
};

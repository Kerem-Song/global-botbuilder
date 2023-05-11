import { Button } from '@components';
import { useModalOpen, usePage } from '@hooks';
import { ISearchData } from '@models/interfaces/IUtterance';
import { useState } from 'react';

import { ToSearch } from './ToSearch';
import { UtteranceDetailPopup } from './UtteranceDetailPopup';
import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';
import { UtterancePopup } from './UtterancePopup';

export const UtteranceComponent = () => {
  const { t } = usePage();
  const [searchData, setSearchData] = useState<ISearchData>({
    sort: 1,
    scenarios: 'all',
    searchWord: undefined,
  });
  const { isOpen: isOpenUtterancePopup, handleIsOpen: handleIsOpenUtterancePopup } =
    useModalOpen();
  const {
    isOpen: isOpenUtteranceDetailPopup,
    handleIsOpen: handleIsOpenUtteranceDetailPopup,
  } = useModalOpen();

  return (
    <>
      <div className="utteranceWrap">
        <div className="title">{t('TITLE')}</div>
        <Button onClick={() => handleIsOpenUtterancePopup(true)}>테스트</Button>
        <ToSearch searchData={searchData} setSearchData={setSearchData} />
        <div className="utteranceListWrap">
          <table className="utteranceTable">
            <thead>
              <UtteranceListHeader />
            </thead>
            <tbody>
              <UtteranceListItem searchData={searchData} />
            </tbody>
          </table>
        </div>
      </div>
      <UtterancePopup
        isOpenUtterancePopup={isOpenUtterancePopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
        handleIsOpenUtteranceDetailPopup={handleIsOpenUtteranceDetailPopup}
        searchData={searchData}
        setSearchData={setSearchData}
      />
      <UtteranceDetailPopup
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        handleIsOpenUtteranceDetailPopup={handleIsOpenUtteranceDetailPopup}
        handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
      />
    </>
  );
};

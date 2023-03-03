import { ISearchData } from '@models/interfaces/IUtterance';
import { useState } from 'react';

import { ToSearch } from './ToSearch';
import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export const UtteranceComponent = () => {
  const [searchData, setSearchData] = useState<ISearchData>({
    sort: 1,
    scenarios: 'all',
    searchWord: undefined,
  });

  return (
    <div className="utteranceWrap">
      <div className="title">Intent Management</div>
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
  );
};

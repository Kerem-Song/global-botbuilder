import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { ISearchData } from '@models/interfaces/IUtterance';
import { useState } from 'react';

import { ToSearch } from './ToSearch';
import { UtteranceListHeader } from './UtteranceListHeader';
import { UtteranceListItem } from './UtteranceListItem';

export const UtteranceComponent = () => {
  const { getIntentListQuery } = useUtteranceClient();
  const [searchData, setSearchData] = useState<ISearchData>({
    sort: 1,
    scenarios: undefined,
    searchWord: undefined,
  });
  const { data } = getIntentListQuery(
    searchData.sort,
    searchData.scenarios,
    searchData.searchWord,
  );

  return (
    <div className="utteranceWrap">
      <div className="title">Intent Management</div>
      <ToSearch sortData={data} searchData={searchData} setSearchData={setSearchData} />
      <div className="utteranceListWrap">
        <table className="utteranceTable">
          <thead>
            <UtteranceListHeader />
          </thead>
          <tbody>
            <UtteranceListItem
              data={data}
              searchData={searchData}
              setSearchData={setSearchData}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

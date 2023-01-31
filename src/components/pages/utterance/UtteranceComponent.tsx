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
    scenarios: null,
  });
  const { data } = getIntentListQuery(searchData.sort, searchData.scenarios);

  return (
    <div className="utteranceWrap">
      <div className="title">Intent Management</div>
      <ToSearch data={data} searchData={searchData} setSearchData={setSearchData} />
      <div className="utteranceListWrap">
        <table className="utteranceTable">
          <thead>
            <UtteranceListHeader />
          </thead>
          <tbody>
            <UtteranceListItem data={data} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

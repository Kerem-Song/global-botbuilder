import { usePage } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DeployButtons } from './DeployButtons';
import { DeployHistoryList } from './DeployHistoryList';
import { DeployPagination } from './DeployPagination';

export const DeployComponent = () => {
  const countPerPage = 30;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = usePage();
  const { botId } = useParams();
  const { getDeployHistoryListQuery } = useDeployClient();
  const { data, isFetching } = getDeployHistoryListQuery({
    pageNo: currentPage,
    countPerPage: countPerPage,
    botId: botId!,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data?.result.totalPage);
    }
  }, [data]);

  return (
    <div className="deployContainer">
      <div className="title">{t('TITLE')}</div>
      <div className="deployInfo">
        <div className="referenceTime">{t('REFERENCE_TIME')} : UTC+09:00</div>
        <DeployButtons />
      </div>
      <div className="deployHistoryListWrap">
        <DeployHistoryList data={data} isFetching={isFetching} />
      </div>
      <DeployPagination
        data={data}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

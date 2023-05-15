import { usePage } from '@hooks';
import { useDeployClient } from '@hooks/client/deployClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DeployButtons } from './DeployButtons';
import { DeployHistoryListItem } from './DeployHistoryListItem';
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
        <table className="deployHistoryListTable">
          <thead>
            <tr>
              <th className="deployHistoryList deployNumber">{t('DEPLOY_NUMBER')}</th>
              <th className="deployHistoryList channelType">{t('CHANNEL_TYPE')}</th>
              <th className="deployHistoryList channelName">{t('CHANNEL_NAME')}</th>
              <th className="deployHistoryList deployDateTime">
                {t('DEPLOYMENT_DATE_AND_TIME')}
              </th>
              <th className="deployHistoryList account">{t('OPERATOR_ACCOUNT')}</th>
              <th className="deployHistoryList status">{t('DEPLOYMENT_STATUS')}</th>
              <th className="deployHistoryList memo">{t('MEMO')}</th>
            </tr>
          </thead>
          <DeployHistoryListItem data={data} isFetching={isFetching} />
        </table>
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

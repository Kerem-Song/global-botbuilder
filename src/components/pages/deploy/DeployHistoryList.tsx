import { usePage } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import { IResponseSearchDeployHistory } from '@models/interfaces/IDeploy';
import { FC } from 'react';

import { DeployHistoryListItem } from './DeployHistoryListItem';

export interface IDeployHistoryList {
  data: IHasResult<IPagingItems<IResponseSearchDeployHistory>> | undefined;
}

export const DeployHistoryList: FC<IDeployHistoryList> = ({ data }) => {
  const { t } = usePage();
  return (
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
      <DeployHistoryListItem data={data} />
    </table>
  );
};

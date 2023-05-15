import { icNoResult } from '@assets';
import { useModalOpen, usePage } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import { IResponseSearchDeployHistory } from '@models/interfaces/IDeploy';
import { util } from '@modules/util';
import classNames from 'classnames';
import { FC, useState } from 'react';
import MultiClamp from 'react-multi-clamp';

import { DeployDetailModal } from './DeployDetailModal';
import { DeploySkeleton } from './DeploySkeleton';

export interface IDeployHistoryListItem {
  data?: IHasResult<IPagingItems<IResponseSearchDeployHistory>>;
  isFetching: boolean;
}

export const DeployHistoryListItem: FC<IDeployHistoryListItem> = ({
  data,
  isFetching,
}) => {
  const { t } = usePage();
  const { isOpen, handleIsOpen } = useModalOpen();
  const [detailInfo, setDetailInfo] = useState({});

  return (
    <tbody>
      {isFetching && <DeploySkeleton />}
      {data &&
        data.result.items.length > 0 &&
        data.result.items.map((x, i) => {
          return (
            <tr
              key={i}
              className="list"
              role="presentation"
              onClick={() => {
                setDetailInfo(x);
                handleIsOpen(true);
              }}
            >
              <td className="deployHistoryList deployNumber">{x.no}</td>
              <td className="deployHistoryList channelType">
                {x.isLive === true ? t('OPERATIONAL') : t('TEST')}
              </td>
              <td className="deployHistoryList channelName">{x.snsChannel}</td>
              <td className="deployHistoryList deployDateTime">
                {util.formatDateTime(new Date(x.createAt))}
              </td>
              <td className="deployHistoryList accountInfo">
                <MultiClamp clamp={1}>{x.actorName}</MultiClamp>
                <MultiClamp clamp={1}>{x.actorEmail}</MultiClamp>
              </td>
              <td className="deployHistoryList status">
                <span
                  className={classNames('success', { failed: x.isSuccess === false })}
                >
                  {x.isSuccess === true ? t('SUCCESS') : t('FAILED')}
                </span>
              </td>
              <td
                className={classNames('deployHistoryList memo text', {
                  empty: x.comment === null,
                })}
              >
                <MultiClamp clamp={2}>{x.comment ? x.comment : '-'}</MultiClamp>
              </td>
            </tr>
          );
        })}
      {data?.result.items.length === 0 && (
        <tr className="emptyList">
          <td className="empty">
            <img src={icNoResult} alt="empty" />
            <span>{t('NO_DEPLOYMENT_HISTORY')}</span>
          </td>
        </tr>
      )}
      {isOpen && (
        <DeployDetailModal
          isOpen={isOpen}
          handleIsOpen={handleIsOpen}
          detailInfo={detailInfo}
        />
      )}
    </tbody>
  );
};

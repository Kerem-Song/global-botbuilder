import { useModalOpen, usePage } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import { IResponseSearchDeployHistory } from '@models/interfaces/IDeploy';
import classNames from 'classnames';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { DeployDetailModal } from './DeployDetailModal';

export interface IDeployHistoryListItem {
  data: IHasResult<IPagingItems<IResponseSearchDeployHistory>> | undefined;
}

export const DeployHistoryListItem: FC<IDeployHistoryListItem> = ({ data }) => {
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();
  return (
    <>
      <tbody role="presentation" onClick={() => handleIsOpen(true)}>
        {data?.result.items.map((x, i) => {
          return (
            <tr className="list" key={i}>
              <td className="deployHistoryList deployNumber">{x.no}</td>
              <td className="deployHistoryList channelType">
                {x.isLive === true ? t('OPERATIONAL') : t('TEST')}
              </td>
              <td className="deployHistoryList channelName">{x.snsChannel}</td>
              <td className="deployHistoryList deployDateTime">{x.deployedTime}</td>
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
      </tbody>
      {isOpen && (
        <DeployDetailModal isOpen={isOpen} handleIsOpen={handleIsOpen} data={data} />
      )}
    </>
  );
};

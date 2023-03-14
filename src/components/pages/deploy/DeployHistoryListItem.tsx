import { usePage } from '@hooks';
import classNames from 'classnames';
import MultiClamp from 'react-multi-clamp';

export const DeployHistoryListItem = () => {
  const { t } = usePage();

  return (
    <tr className="list">
      <td className="deployHistoryList deployNumber">000037-T</td>
      <td className="deployHistoryList channelType">Operational</td>
      <td className="deployHistoryList channelName">@lunasoft_line_test</td>
      <td className="deployHistoryList deployDateTime">YYYY-MM-DD hh:mm:ss</td>
      <td className="deployHistoryList account">Marina (mj.lee@lunasoft.co.kr)</td>
      <td className="deployHistoryList status">
        <span className="success">{t('SUCCESS')}</span>
      </td>
      <td className="deployHistoryList memo text">
        <MultiClamp clamp={2}>
          Expose deployment notes. Shorten when out of zone ddd
        </MultiClamp>
      </td>
    </tr>
  );
};

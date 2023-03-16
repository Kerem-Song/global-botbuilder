import { usePage } from '@hooks';
import classNames from 'classnames';
import MultiClamp from 'react-multi-clamp';

export const DeployHistoryListItem = () => {
  const { t } = usePage();

  return (
    <tbody>
      <tr className="list">
        <td className="deployHistoryList deployNumber">000037-T</td>
        <td className="deployHistoryList channelType">{t('OPERATIONAL')}</td>
        <td className="deployHistoryList channelName">@lunasoft_line_test</td>
        <td className="deployHistoryList deployDateTime">YYYY-MM-DD hh:mm:ss</td>
        <td className="deployHistoryList account">Marina (mj.lee@lunasoft.co.kr)</td>
        <td className="deployHistoryList status">
          <span className="success">{t('SUCCESS')}</span>
        </td>
        <td className="deployHistoryList memo text">
          <MultiClamp clamp={2}>
            배포 메모를 노출합니다. 영역 초과시 말줄임 표시를 하게 됩니다. 진짜로
          </MultiClamp>
        </td>
      </tr>
    </tbody>
  );
};

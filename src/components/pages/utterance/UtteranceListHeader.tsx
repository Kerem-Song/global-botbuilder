import { usePage } from '@hooks';
import classNames from 'classnames';
import { FC } from 'react';
import { useParams } from 'react-router';

export interface IUtteranceListHeaderProps {
  isOpenUtterancePopup?: boolean;
  handleDetailPopupOpen?: () => void;
}

export const UtteranceListHeader: FC<IUtteranceListHeaderProps> = ({
  isOpenUtterancePopup,
  handleDetailPopupOpen,
}) => {
  const { utterancdId, botId } = useParams();
  const { navigate, t } = usePage();
  const showScenarioList = isOpenUtterancePopup === false;

  const goToDetail = () => {
    if (!utterancdId && showScenarioList) {
      navigate(`/${botId}/utterance/detail/`);
      return;
    }

    if (!showScenarioList && handleDetailPopupOpen) {
      handleDetailPopupOpen();
      return;
    }
  };

  return (
    <tr>
      <th
        className={classNames('utteranceList intent add', {
          'hidden-scenarioList': !showScenarioList,
        })}
      >
        {t('INTENT')}
        <button className="addBtn" onClick={goToDetail} />
      </th>
      {showScenarioList ? (
        <th className="utteranceList connectScenarios">{t('CONNECT_SCENARIOS')}</th>
      ) : null}
      <th className="utteranceList utterance">{t('UTTERANCE')}</th>
      <th className="utteranceList icon" />
    </tr>
  );
};

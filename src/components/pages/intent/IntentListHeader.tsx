import { useI18n, usePage } from '@hooks';
import classNames from 'classnames';
import { FC } from 'react';
import { useParams } from 'react-router';

export interface IIntentListHeaderProps {
  isOpenUtterancePopup?: boolean;
  handleDetailPopupOpen?: () => void;
}

export const IntentListHeader: FC<IIntentListHeaderProps> = ({
  isOpenUtterancePopup,
  handleDetailPopupOpen,
}) => {
  const { utterancdId, botId } = useParams();
  const { navigate } = usePage();
  const { t } = useI18n('intent');

  const showScenarioList = isOpenUtterancePopup === false;

  const goToDetail = () => {
    if (!utterancdId && showScenarioList) {
      navigate(`/${botId}/intent/detail/`);
      return;
    }

    if (!showScenarioList && handleDetailPopupOpen) {
      handleDetailPopupOpen();
      return;
    }
  };

  return (
    <thead className="intentThead">
      <tr className="intentTheadTr">
        <th
          className={classNames('intentList intent add', {
            'hidden-scenarioList': !showScenarioList,
          })}
        >
          {t('INTENT')}
          <button className="addBtn" onClick={goToDetail} />
        </th>
        {showScenarioList ? (
          <th className="intentList connectScenarios">{t('CONNECT_SCENARIOS')}</th>
        ) : null}
        <th
          className={classNames('intentList utterance', {
            'hidden-scenarioList-intent': !showScenarioList,
          })}
        >
          {t('UTTERANCE')}
        </th>
        <th className="intentList icon" />
      </tr>
    </thead>
  );
};

import { usePage } from '@hooks';
import { useParams } from 'react-router';

export const UtteranceListHeader = () => {
  const { utterancdId, botId } = useParams();
  const { navigate, t, tc } = usePage();

  const goToDetail = () => {
    if (!utterancdId) {
      navigate(`/${botId}/utterance/detail/`);
    }
  };
  return (
    <tr>
      <th className="utteranceList intent add">
        {t('INTENT')}
        <button className="addBtn" onClick={goToDetail} />
      </th>
      <th className="utteranceList connectScenarios">{t('CONNECT_SCENARIOS')}</th>
      <th className="utteranceList utterance">{t('UTTERANCE')}</th>
      <th className="utteranceList icon" />
    </tr>
  );
};

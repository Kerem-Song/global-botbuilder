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
        Intent
        <button className="addBtn" onClick={goToDetail} />
      </th>
      <th className="utteranceList connectScenarios">Connect Scenarios</th>
      <th className="utteranceList utterance">Utterance</th>
      <th className="utteranceList icon" />
    </tr>
  );
};

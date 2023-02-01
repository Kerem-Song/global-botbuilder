import { useUtteranceClient } from '@hooks';
import { useNavigate } from 'react-router';

export const UtteranceListHeader = () => {
  const { getIntentDetailQuery } = useUtteranceClient();
  const navigate = useNavigate();
  const goToDetail = () => {
    navigate(':utteranceId');
  };
  return (
    <tr>
      <th className="utteranceList intent add">
        Intent
        <button className="addBtn" onClick={goToDetail} />
      </th>
      <th className="utteranceList connectScenarios">Connect Scenarios</th>
      <th className="utteranceList utterance">Utterance</th>
      <th className="utteranceList icon"></th>
    </tr>
  );
};

import { icUtteranceEmpty } from '@assets';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { AlertModal } from './AlertModal';

export const UtteranceListItem = () => {
  const { utteranceListItemMutate } = useUtteranceClient();
  const navigate = useNavigate();
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);

  const closeAlert = () => {
    setIsOpenAlert(false);
  };

  const openAlert = () => {
    setIsOpenAlert(true);
  };

  return (
    <>
      <tr className="list">
        <td
          role="presentation"
          className="utteranceList intent"
          onClick={() => navigate(':utteranceId')}
        >
          Point
        </td>
        <td className="utteranceList connectScenarios">Point check</td>
        <td className="utteranceList utterance">
          points, points check, points check, points accumulated...
        </td>
        <td className="utteranceList icon">
          <button className="icDelete" onClick={openAlert} />
          <AlertModal isOpenAlert={isOpenAlert} closeAlert={closeAlert} />
        </td>
      </tr>
      <tr className="emptyList">
        <td className="empty">
          <img src={icUtteranceEmpty} alt="empty" />
          <span>No search results found.</span>
        </td>
      </tr>
      <tr className="emptyList">
        <td className="empty">
          <img src={icUtteranceEmpty} alt="empty" />
          <span>No registered intents.</span>
        </td>
      </tr>
    </>
  );
};

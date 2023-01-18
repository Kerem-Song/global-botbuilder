import { icUtteranceEmpty } from '@assets';
import { useState } from 'react';

import { AlertModal } from './AlertModal';

export const UtteranceListItem = () => {
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const closeAlert = () => {
    setIsOpenAlert(false);
  };
  const openAlert = () => {
    setIsOpenAlert(true);
    console.log('open');
  };

  return (
    <>
      <tr className="list">
        <td className="utteranceList intent">Point</td>
        <td className="utteranceList connectScenarios">Point check</td>
        <td className="utteranceList utterance">
          points, points check, points check, points accumulated...
        </td>
        <td className="utteranceList icon">
          <button className="icDelete" onClick={openAlert} />
          <AlertModal isOpenAlert={isOpenAlert} closeAlert={closeAlert} />
        </td>
      </tr>
      <tr className="list">
        <td className="utteranceList intent">Go to SNS</td>
        <td className="utteranceList connectScenarios">-</td>
        <td className="utteranceList utterance">
          SNS, Facebook, insragram, kakaotail, line
        </td>
        <td className="utteranceList icon">
          <button className="icDelete" onClick={openAlert}></button>
        </td>
      </tr>
      <tr className="list">
        <td className="utteranceList intent">Go to SNS</td>
        <td className="utteranceList connectScenarios">-</td>
        <td className="utteranceList utterance">
          SNS, Facebook, insragram, kakaotail, line
        </td>
        <td className="utteranceList icon">
          <button className="icDelete" onClick={openAlert}></button>
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

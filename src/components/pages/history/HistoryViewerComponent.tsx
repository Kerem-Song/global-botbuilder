import { useRootState } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { usePrompt } from '@hooks/usePrompt';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { Botbuilder } from '../scenario/BotBuilder';

export const HistoryViewerComponent = () => {
  const dispatch = useDispatch();
  const { botId, historyId } = useParams();
  const { getFlowSnapShot } = useHistoryClient();
  const { data } = getFlowSnapShot({ botId: botId!, historyId: historyId! });
  console.log('@data in viewer', data?.result);
  useEffect(() => {
    if (!data) {
      return;
    }
    dispatch(setSelectedScenario(data.result));
  }, [data]);

  return (
    <div className="scenarioWrapper">
      <div className="botBuilderWrapper">
        <Botbuilder />
      </div>
    </div>
  );
};

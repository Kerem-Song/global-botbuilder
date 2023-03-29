import { useRootState } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { usePrompt } from '@hooks/usePrompt';
import { initBotBuilder, setSelectedScenario } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { Botbuilder } from '../scenario/BotBuilder';

export const HistoryViewerComponent = () => {
  const dispatch = useDispatch();
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);
  const { botId, historyId } = useParams();
  // console.log('botid, historyid', botId, historyId);
  useEffect(() => {
    dispatch(initBotBuilder());
    return () => {
      dispatch(initBotBuilder());
      dispatch(initNodes([]));
      dispatch(ActionCreators.clearHistory());
    };
  }, []);

  const { getFlowSnapShot } = useHistoryClient();
  const { data } = getFlowSnapShot({ botId: botId!, historyId: historyId! });
  console.log('@data in viewer', data?.result);
  useEffect(() => {
    if (!data) {
      return;
    }
    dispatch(setSelectedScenario(data.result));
  }, [data]);

  usePrompt(changed);

  return (
    <div className="scenarioWrapper">
      <div className="botBuilderWrapper">
        <Botbuilder />
      </div>
    </div>
  );
};

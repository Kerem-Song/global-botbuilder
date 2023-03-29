import { useRootState, useScenarioClient } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { usePrompt } from '@hooks/usePrompt';
import { useSelectedScenarioChange } from '@hooks/useSelectedScenarioChange';
import { IScenarioModel } from '@models';
import { initBotBuilder } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { Botbuilder } from '../scenario/BotBuilder';
import { ManagementComponent } from '../scenario/ManagementComponent';

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

  // const { } = getFlowSnapShot({ botId: botId!, historyId: historyId! });

  const [scenarioList, setScenarioList] = useState<IScenarioModel[]>([]);
  // console.log('@data in viewer', data);
  // useEffect(() => {
  //   if (!data) {
  //     return;
  //   }
  // setScenarioList(
  // data
  // .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
  // .filter(
  //   (x) =>
  //     (!isActivated || x.activated) &&
  //     (!searchKeyword ||
  //       x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
  // ),
  // );
  // }, [data]);

  usePrompt(changed);

  return (
    <div className="scenarioWrapper">
      {/* <ManagementComponent /> */}
      <div className="botBuilderWrapper">
        <Botbuilder />
      </div>
    </div>
  );
};

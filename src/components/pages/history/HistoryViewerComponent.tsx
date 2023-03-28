import { useRootState, useScenarioClient } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { useSelectedScenarioChange } from '@hooks/useSelectedScenarioChange';
import { IScenarioModel } from '@models';
import { initBotBuilder } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { Botbuilder } from '../scenario/BotBuilder';
import { ManagementComponent } from '../scenario/ManagementComponent';

export const HistoryViewerComponent = () => {
  const dispatch = useDispatch();
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);

  useEffect(() => {
    dispatch(initBotBuilder());
    return () => {
      dispatch(initBotBuilder());
      dispatch(initNodes([]));
      dispatch(ActionCreators.clearHistory());
    };
  }, []);

  const { handleChangeSelectedScenario } = useSelectedScenarioChange();
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActivated, setIsActivated] = useState(false);
  const [scenarioList, setScenarioList] = useState<IScenarioModel[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setScenarioList(
      data
        .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
        .filter(
          (x) =>
            (!isActivated || x.activated) &&
            (!searchKeyword ||
              x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
        ),
    );
  }, [searchKeyword, isActivated, data]);

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

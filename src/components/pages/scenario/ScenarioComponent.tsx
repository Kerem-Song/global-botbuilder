import { useRootState } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { initBotBuilder } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
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

  usePrompt(changed);
  return (
    <div className="scenarioWrapper">
      <ManagementComponent />
      <div className="botBuilderWrapper">
        <BotBuilderHeader />
        <Botbuilder />
      </div>
    </div>
  );
};

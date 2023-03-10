import { useRootState } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { initBotBuilder } from '@store/botbuilderSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
  const dispatch = useDispatch();
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);
  useEffect(() => {
    dispatch(initBotBuilder());
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

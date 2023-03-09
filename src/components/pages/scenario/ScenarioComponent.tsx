import { usePrompt } from '@hooks/usePrompt';
import { initBotBuilder } from '@store/botbuilderSlice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useBeforeUnload } from 'react-router-dom';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
  const dispatch = useDispatch();
  dispatch(initBotBuilder());
  usePrompt();
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

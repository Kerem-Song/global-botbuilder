import { useCallbackPrompt } from '@hooks/useCallbackPrompt';
import { initBotBuilder } from '@store/botbuilderSlice';
import { useDispatch } from 'react-redux';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
  const dispatch = useDispatch();
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(false);
  dispatch(initBotBuilder());

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

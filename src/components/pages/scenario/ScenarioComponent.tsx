import '@styles/scenario.scss';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { BotTester } from './BotTester';
import { ScenarioManagement } from './ScenarioManagement';
export const ScenarioComponent = () => {
  return (
    <div className="scenarioWrapper">
      <ScenarioManagement />
      <div className="botBuilderWrapper">
        <BotBuilderHeader />
        <Botbuilder />
      </div>
      <BotTester />
    </div>
  );
};

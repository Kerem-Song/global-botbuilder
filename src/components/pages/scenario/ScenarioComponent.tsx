import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { BotTester } from './BotTester';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
  return (
    <div className="scenarioWrapper">
      <ManagementComponent />
      <div className="botBuilderWrapper">
        <BotBuilderHeader />
        <Botbuilder />
      </div>
      <BotTester />
    </div>
  );
};

import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { setSesstionToken } from '@store/botbuilderSlice';
import { useDispatch } from 'react-redux';

import { Botbuilder } from './BotBuilder';
import { BotBuilderHeader } from './BotBuilderHeader';
import { ManagementComponent } from './ManagementComponent';

export const ScenarioComponent = () => {
  const { token, isFetching } = useSessionTokenClient();

  const dispatch = useDispatch();
  if (isFetching) {
    return <></>;
  }

  dispatch(setSesstionToken(token));

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

import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useRootState } from '../../hooks/useRootState';

export const HistoryViewerHeader: FC<{ isBotPage?: boolean }> = ({ isBotPage }) => {
  const botName = useRootState((state) => state.botInfoReducer.botInfo?.botName);
  const scenarioName = useRootState(
    (state) => state.botBuilderReducer.selectedScenario?.alias,
  );

  const { createByBrand, actorEmail, actorName } = useParams();

  return (
    <header className="historyViewerHeader">
      <div className="headerWapper">
        <div className="brandPage">
          <span className="brandName">{botName}</span>
          <span className="pageName">{scenarioName}</span>
        </div>
        <div className="rightNav">
          <span>{createByBrand}</span>
          <span>{actorEmail}</span>
          <span>{actorName}</span>
        </div>
      </div>
    </header>
  );
};

import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const HistoryViewerHeader: FC<{ isBotPage?: boolean }> = ({ isBotPage }) => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const dispatch = useDispatch();
  const botName = useRootState((state) => state.botInfoReducer.botInfo?.botName);
  const scenarioName = useRootState(
    (state) => state.botBuilderReducer.selectedScenario?.alias,
  );

  const historyInfo = useRootState((state) => state.historyInfoReducer.historyInfo);
  // const actorName = useRootState(
  //   (state) => state.historyInfoReducer.historyInfo?.actorName,
  // );
  // const actorEmail = useRootState(
  //   (state) => state.historyInfoReducer.historyInfo?.actorEmail,
  // );
  // const createAt = useRootState(
  //   (state) => state.historyInfoReducer.historyInfo?.createAt,
  // );

  const test = useRootState((state) => state.historyInfoReducer.historyInfo);
  console.log(
    '@from store:',
    historyInfo?.actorEmail,
    historyInfo?.actorName,
    historyInfo?.createAt,
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

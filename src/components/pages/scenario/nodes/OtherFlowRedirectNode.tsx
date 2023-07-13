import { useHistoryViewerMatch, usePage, useScenarioClient } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';
import { useParams } from 'react-router';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();
  const { botId, historyId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);
  const scenario: IScenarioModel[] | undefined = data?.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );
  console.log('@scenario data', data);
  const isHistoryViewer = useHistoryViewerMatch();

  const handleNodeHistoryViewer = () => {
    if (isHistoryViewer) {
      const { getFlowSnapShot } = useHistoryClient();
      const { data: historyData } = getFlowSnapShot({
        botId: botId!,
        historyId: historyId!,
      });
      const scenarioInHistoryViewer = historyData?.result.nodes.filter(
        (item) => item.option === 64 && item.nextNodeId === node.nextNodeId,
      );

      return (
        scenarioInHistoryViewer &&
        scenarioInHistoryViewer.length &&
        scenarioInHistoryViewer.map((itemInHistory) => (
          <div key={itemInHistory.id}>{itemInHistory.nextNodeId}</div>
        ))
      );
    }
  };

  return (
    <div className="command-node">
      {isHistoryViewer ? (
        handleNodeHistoryViewer()
      ) : scenario && scenario.length ? (
        scenario.map((item, i) => <div key={item.id}>{item.alias}</div>)
      ) : (
        <div>{t(`OTHER_FLOW_REDIRECT_NODE_SELECT`)}</div>
      )}
    </div>
  );
};

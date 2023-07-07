import { usePage, useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';
import { useParams } from 'react-router';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();
  const { botId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);
  const scenario: IScenarioModel[] | undefined = data?.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );

  return (
    <div className="command-node">
      {scenario && scenario.length ? (
        scenario.map((item, i) => <div key={item.id}>{item.alias}</div>)
      ) : (
        <div>{t(`OTHER_FLOW_REDIRECT_NODE_SELECT`)}</div>
      )}
    </div>
  );
};

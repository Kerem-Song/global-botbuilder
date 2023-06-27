import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const scenario: IScenarioModel[] = data!.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );

  return (
    <div className="command-node">
      {scenario.map((item) => (
        <div key={item.id}>{item.alias}</div>
      ))}
    </div>
  );
};

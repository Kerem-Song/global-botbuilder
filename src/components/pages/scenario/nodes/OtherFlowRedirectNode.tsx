import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import classNames from 'classnames';
import { FC } from 'react';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const scenario: IScenarioModel[] = data!.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );

  return (
    <>
      {scenario.map((item) => (
        <div
          className={classNames('command-node', { inactive: !item.activated })}
          key={item.id}
        >
          <div>{item.alias}</div>
        </div>
      ))}
    </>
  );
};

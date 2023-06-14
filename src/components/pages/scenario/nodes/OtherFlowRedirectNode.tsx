import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import classNames from 'classnames';
import { FC } from 'react';
import { useParams } from 'react-router';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { botId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);
  const scenario: IScenarioModel[] | undefined = data?.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );

  return (
    <>
      {scenario?.map((item) => (
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

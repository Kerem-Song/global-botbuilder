import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';
import { useParams } from 'react-router';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const { botId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);
  const scenario: IScenarioModel[] | undefined = data?.filter(
    (item) => item.firstNodeId === node.nextNodeId,
  );

  // gp-1427 시나리오 리스트에서 삭제시 노드도 같이 삭제
  // useEffect(() => {
  //   if (!scenario?.length) {
  //     dispatch(removeItem(node.id));
  //     dispatch(setSelected());
  //   }
  // }, [scenario]);

  return (
    <div className="command-node">
      {scenario?.map((item) => (
        <div key={item.id}>{item.alias}</div>
      ))}
    </div>
  );
};

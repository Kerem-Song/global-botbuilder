import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const OtherFlowRedirectNode: FC<IHasNode> = ({ node }) => {
  const dispatch = useDispatch();
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
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

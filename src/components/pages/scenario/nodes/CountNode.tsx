import { Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { INode } from '@models';
import { IRetryConditionView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

interface ICountNodeProps {
  nodeId: string;
  node: INode;
}
export const CountNode: FC<ICountNodeProps> = ({ nodeId, node }) => {
  const view: IRetryConditionView = node.view as IRetryConditionView;
  console.log('view in count node', view);
  return (
    <Card>
      <div className="countConditionWrapper">Retry {view?.count && view?.count}</div>
      <NextNodeButton
        ctrlId={`${nodeId}-true`}
        nodeId={nodeId}
        type="green"
        offset={50}
      />
      <NextNodeButton
        ctrlId={`${nodeId}-false`}
        nodeId={nodeId}
        type="yellow"
        offset={80}
      />
    </Card>
  );
};

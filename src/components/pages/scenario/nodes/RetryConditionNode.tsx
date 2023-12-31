import { Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IRetryConditionView } from '@models/interfaces/res/IGetFlowRes';
import { FALSE_SUFFIX, NODE_PREFIX, TRUE_SUFFIX } from '@modules';
import { FC } from 'react';

export const RetryConditionNode: FC<IHasNode> = ({ node }) => {
  const view: IRetryConditionView = node.view as IRetryConditionView;

  return (
    <Card>
      <div className="countConditionWrapper">Retry {view?.count && view?.count}</div>
      <NextNodeButton
        ctrlId={`${node.id}${TRUE_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="green"
        offset={50}
      />
      <NextNodeButton
        ctrlId={`${node.id}${FALSE_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="yellow"
        offset={80}
      />
    </Card>
  );
};

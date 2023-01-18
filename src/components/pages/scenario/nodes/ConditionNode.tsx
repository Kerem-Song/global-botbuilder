import { Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { ConditionJoin, ConditionOperator, INode } from '@models';
import { IConditionView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

interface IConditionNodeProps {
  nodeId: string;
  node: INode;
}
export const ConditionNode: FC<IConditionNodeProps> = ({ nodeId, node }) => {
  const view: IConditionView = node.view as IConditionView;
  return (
    <Card>
      <div className="countConditionWrapper" key={`${nodeId}-condition-${nodeId}`}>
        {view.items?.map((item, i) => {
          return (
            <p key={i}>
              {i === 0 || view.join === undefined ? ' ' : ConditionJoin[view.join]} if{' '}
              {item.op1} {ConditionOperator[item.operator]} {item.op2}
            </p>
          );
        })}
      </div>
      <NextNodeButton
        ctrlId={`${nodeId}-true`}
        nodeId={nodeId}
        type="green"
        offset={50}
      />
      <NextNodeButton ctrlId={`${nodeId}-false`} nodeId={nodeId} type="red" offset={80} />
    </Card>
  );
};

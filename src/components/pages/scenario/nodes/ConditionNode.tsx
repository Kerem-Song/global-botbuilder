import { Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { ConditionJoin, ConditionOperator, INode } from '@models';
import { IConditionView } from '@models/interfaces/res/IGetFlowRes';
import { FALSE_SUFFIX, NEXT_BUTTON_PREFIX, NODE_PREFIX, TRUE_SUFFIX } from '@modules';
import { FC } from 'react';

interface IConditionNodeProps {
  node: INode;
}
export const ConditionNode: FC<IConditionNodeProps> = ({ node }) => {
  const view: IConditionView = node.view as IConditionView;
  return (
    <Card>
      <div className="countConditionWrapper">
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
        ctrlId={`${node.id}${TRUE_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="green"
        offset={50}
      />
      <NextNodeButton
        ctrlId={`${node.id}${FALSE_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="red"
        offset={80}
      />
    </Card>
  );
};

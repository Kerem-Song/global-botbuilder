import { Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { IConditionNode, INode } from '@models';
import { FC } from 'react';

interface Condition {
  nodeId: string;
  conditions?: IConditionNode[];
  values: INode;
}
export const Condition: FC<Condition> = ({ nodeId, values, conditions }) => {
  return (
    <Card>
      {conditions?.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${nodeId}-condition-${i}`}>
            <p>
              if &#123;&#123;{item.userInput}&#125;&#125;
              {item.condition}
              {item.comparativeValue}
              {item.variableChoice}
              {item.logicalOperator}
              {item.connectedMessage}
              {item.elseMessage}
            </p>
          </div>
        );
      })}
      <NextNodeButton ctrlId={`${nodeId}-true`} nodeId={nodeId} type="green" index={0} />
      <NextNodeButton ctrlId={`${nodeId}-false`} nodeId={nodeId} type="red" index={1} />
    </Card>
  );
};

import { Button, Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { ICountNode } from '@models';
import { FC } from 'react';

interface Count {
  nodeId: string;
  cards: ICountNode[];
}
export const Count: FC<Count> = ({ nodeId, cards }) => {
  return (
    <Card>
      {cards.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${nodeId}-count-${i}`}>
            <p>{item.requestionNum}</p>
          </div>
        );
      })}
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

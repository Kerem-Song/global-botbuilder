import { Button, Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { ICountNode } from '@models';
import { FC } from 'react';

interface ICountNodeProps {
  nodeId: string;
}
export const CountNode: FC<ICountNodeProps> = ({ nodeId }) => {
  return (
    <Card>
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

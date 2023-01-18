import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { FC } from 'react';

export const IntentNode: FC<{ id?: string }> = ({ id }) => {
  return (
    <div className="command-node">
      <NextNodeButton ctrlId={`${id}`} nodeId={`node-${id}`} type="blue" />
    </div>
  );
};

import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';

export const IntentNode: FC<{ id?: string }> = ({ id }) => {
  return (
    <div className="command-node">
      <NextNodeButton ctrlId={`${id}`} nodeId={`${NODE_PREFIX}${id}`} type="blue" />
    </div>
  );
};

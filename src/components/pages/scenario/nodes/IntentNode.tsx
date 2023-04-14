import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';

export const IntentNode: FC<IHasNode> = ({ node }) => {
  return (
    <div className="command-node">
      <NextNodeButton
        ctrlId={`${node.id}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="blue"
      />
    </div>
  );
};

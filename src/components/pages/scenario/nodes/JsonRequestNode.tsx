import { Card } from '@components';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { NextNodeButton } from '../NextNodeButton';

export const JsonRequestNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IJsonRequestView;
  return (
    <Card>
      <div className="command-node">
        {view.url ? (
          <span style={{ whiteSpace: 'pre-line' }}>
            <MultiClamp clamp={2}>{view.url}</MultiClamp>
          </span>
        ) : (
          <span>Api URL입력</span>
        )}
        <NextNodeButton
          ctrlId={`${node.id}`}
          nodeId={`${NODE_PREFIX}${node.id}`}
          type="blue"
        />
      </div>
    </Card>
  );
};

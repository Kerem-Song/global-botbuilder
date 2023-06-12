import { Card } from '@components/data-display';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';

export const ParameterSetNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IParameterSetView;

  return (
    <Card>
      <div className="countConditionWrapper">
        {view.parameters?.map((item) => (
          <p key={item.name}>{`{{${item.name}}} = ${item.value}`}</p>
        ))}
      </div>
      <NextNodeButton
        ctrlId={`${node.id}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        offset={70}
        type="blue"
      />
    </Card>
  );
};

import { Card } from '@components/data-display';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';

export const ParameterSetNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IParameterSetView;

  return (
    <Card>
      <div className="countConditionWrapper parameterSetNode">
        {view.parameters?.map((item, index) => (
          <p key={index}>{`{{${item.name}}} = ${item.value}`}</p>
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

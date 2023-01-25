import { Card } from '@components/data-display';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { INode } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

export const ParameterSetNode: FC<{ node: INode }> = ({ node }) => {
  const view = node.view as IParameterSetView;

  console.log(view);
  return (
    <Card>
      <div className="countConditionWrapper">
        {Object.keys(view.parameters).map((key: string) => {
          return <p key={key}>{`{{${key}}} = ${view.parameters[key]}`}</p>;
        })}
      </div>
      <NextNodeButton ctrlId={`${node.id}`} nodeId={`node-${node.id}`} type="blue" />
    </Card>
  );
};

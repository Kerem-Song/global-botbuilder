import { Button, Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { INode } from '@models';
import { FC } from 'react';

interface IParameterSet {
  id?: string;
  values?: INode;
  params?: string[];
}
export const ParameterSet: FC<IParameterSet> = ({ id, values, params }) => {
  console.log('parameter set');
  return (
    <Card>
      {params?.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${id}-count-${i}`}>
            {/* <p>{item}</p> */}
          </div>
        );
      })}
      <div className="intent-node parameterSetNextNodeBtn">
        <NextNodeButton ctrlId={`${id}`} nodeId={`node-${id}`} type="blue" />
      </div>
    </Card>
  );
};

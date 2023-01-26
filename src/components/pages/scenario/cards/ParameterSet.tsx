import { Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { INode } from '@models';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';

interface IParameterSet {
  id?: string;
  values?: INode;
  params?: string[];
}
export const ParameterSet: FC<IParameterSet> = ({ id, values, params }) => {
  return (
    <Card>
      {params?.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${id}-count-${i}`}>
            {/* <p>{item}</p> */}
          </div>
        );
      })}
      <div className="command-node">
        <NextNodeButton ctrlId={`${id}`} nodeId={`${NODE_PREFIX}${id}`} type="blue" />
      </div>
    </Card>
  );
};

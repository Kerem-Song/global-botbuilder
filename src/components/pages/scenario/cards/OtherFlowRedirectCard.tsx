import { Card } from '@components';
import { INode } from '@models';
import { FC } from 'react';

interface IOtherFlowRedirect {
  id?: string;
  values?: INode;
  params?: string[];
}
export const OtherFlowRedirectCard: FC<IOtherFlowRedirect> = ({ id, values, params }) => {
  return (
    <Card>
      {params?.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${id}-OtherFlowRedirectCard-${i}`}>
            {/* <p>{item}</p> */}
          </div>
        );
      })}
    </Card>
  );
};

import { INode } from '@models';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { BasicCardView } from '../views/BasicCardView';

export interface IBasicCardNodeProps {
  node: INode;
}

export const BasicCardNode: FC<IBasicCardNodeProps> = ({ node }) => {
  const view = node.view as IBasicCardView;
  return <BasicCardView nodeId={`node-${node.id}`} view={view} />;
};

import { INode } from '@models';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';

import { CommerceCardView } from '../views/CommerceCardView';

interface ICommerceCardNodeProps {
  node: INode;
}

export const CommerceCardNode: FC<ICommerceCardNodeProps> = ({ node }) => {
  const view = node.view as IProductCardView;
  return <CommerceCardView nodeId={`${NODE_PREFIX}${node.id}`} view={view} />;
};

import { INode } from '@models';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';
import { ListCardView } from '../views/ListCardView';

export interface IListCardNodeProps {
  node: INode;
}

export const ListCardNode: FC<IListCardNodeProps> = ({ node }) => {
  const view = node.view as IListCardView;
  return <ListCardView nodeId={`${NODE_PREFIX}${node.id}`} view={view} />;
};

import { IHasNode } from '@models/interfaces/IHasNode';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';

import { ListCardView } from '../views/ListCardView';

export const ListCardNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IListCardView;
  return <ListCardView nodeId={`${NODE_PREFIX}${node.id}`} view={view} />;
};

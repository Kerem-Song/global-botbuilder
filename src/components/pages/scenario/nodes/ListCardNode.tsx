import { IHasNode } from '@models/interfaces/IHasNode';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';
import { ListCardView } from '../views/ListCardView';

export const ListCardNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IListCardView;
  return <ListCardView nodeId={`${NODE_PREFIX}${node.id}`} view={view} />;
};

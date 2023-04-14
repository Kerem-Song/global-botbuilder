import { IHasNode } from '@models/interfaces/IHasNode';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';
import { BasicCardView } from '../views/BasicCardView';

export const BasicCardNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IBasicCardView;
  return <BasicCardView nodeId={`${NODE_PREFIX}${node.id}`} view={view} />;
};

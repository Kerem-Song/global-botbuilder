import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';

export const CSCenterSceneNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();

  return <div className="command-node"></div>;
};

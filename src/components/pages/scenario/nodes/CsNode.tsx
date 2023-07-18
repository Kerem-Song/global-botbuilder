import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { FC } from 'react';

export const CsNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();

  return <div className="command-node"></div>;
};

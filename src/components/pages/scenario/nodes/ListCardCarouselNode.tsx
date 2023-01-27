import { Carousel } from '@components/data-display/Carousel';
import { INode } from '@models';
import { IListCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';
import { ListCardView } from '../views/ListCardView';

export interface IListCardCarouselNodeProps {
  node: INode;
}

export const ListCardCarouselNode: FC<IListCardCarouselNodeProps> = ({ node }) => {
  const view = node.view as IListCardCarouselView;
  return (
    <Carousel nodeId={`${NODE_PREFIX}${node.id}`} addCarousel>
      {view.childrenViews.map((v) => {
        return <ListCardView key={v.id} nodeId={`${NODE_PREFIX}${node.id}`} view={v} />;
      })}
    </Carousel>
  );
};

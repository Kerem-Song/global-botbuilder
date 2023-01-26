import { Carousel } from '@components/data-display/Carousel';
import { INode } from '@models';
import { IBasicCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { NODE_PREFIX } from '../../../../modules';
import { BasicCardView } from '../views/BasicCardView';

export interface IBasicCardCarouselNodeProps {
  node: INode;
}

export const BasicCardCarouselNode: FC<IBasicCardCarouselNodeProps> = ({ node }) => {
  const view = node.view as IBasicCardCarouselView;
  return (
    <Carousel nodeId={`${NODE_PREFIX}${node.id}`} addCarousel>
      {view.childrenViews.map((v) => {
        return <BasicCardView key={v.id} nodeId={`${NODE_PREFIX}${node.id}`} view={v} />;
      })}
    </Carousel>
  );
};

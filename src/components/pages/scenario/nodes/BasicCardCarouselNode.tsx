import { Carousel } from '@components/data-display/Carousel';
import { INode } from '@models';
import { IBasicCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { BasicCardView } from '../views/BasicCardView';

export interface IBasicCardCarouselNodeProps {
  node: INode;
}

export const BasicCardCarouselNode: FC<IBasicCardCarouselNodeProps> = ({ node }) => {
  const view = node.view as IBasicCardCarouselView;
  return (
    <Carousel nodeId={`node-${node.id}`} addCarousel>
      {view.childrenViews.map((v) => {
        return <BasicCardView key={v.id} nodeId={`node-${node.id}`} view={v} />;
      })}
    </Carousel>
  );
};

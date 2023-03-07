import { Carousel } from '@components/pages/scenario/Carousel';
import { INode } from '@models';
import {
  IProductCardCarouselView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { updateNode } from '@store/makingNode';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { CommerceCardView } from '../views/CommerceCardView';

interface ICommerceCardCarouselNodeProps {
  node: INode;
}

export const CommerceCardCarouselNode: FC<ICommerceCardCarouselNodeProps> = ({
  node,
}) => {
  const dispath = useDispatch();
  const view = node.view as IProductCardCarouselView;

  const HandleAddCarousel = () => {
    const childrenViews: IProductCardView[] = [
      ...view.childrenViews,
      nodeDefaultHelper.createCommerceView(),
    ];
    const upNode = {
      ...node,
      view: { ...view, childrenViews } as IProductCardCarouselView,
    };
    dispath(updateNode(upNode));
  };

  return (
    <Carousel nodeId={`${NODE_PREFIX}${node.id}`} addCarousel={HandleAddCarousel}>
      {view.childrenViews.map((v, index) => {
        return (
          <CommerceCardView
            key={v.id}
            nodeId={`${NODE_PREFIX}${node.id}`}
            view={v}
            index={index}
          />
        );
      })}
    </Carousel>
  );
};

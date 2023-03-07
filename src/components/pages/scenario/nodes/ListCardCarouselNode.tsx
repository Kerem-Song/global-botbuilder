import { Carousel } from '@components/pages/scenario/Carousel';
import { INode } from '@models';
import { IListCardCarouselView, IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { updateNode } from '@store/makingNode';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ListCardView } from '../views/ListCardView';

export interface IListCardCarouselNodeProps {
  node: INode;
}

export const ListCardCarouselNode: FC<IListCardCarouselNodeProps> = ({ node }) => {
  const dispath = useDispatch();
  const view = node.view as IListCardCarouselView;

  const HandleAddCarousel = () => {
    const childrenViews: IListCardView[] = [
      ...view.childrenViews,
      nodeDefaultHelper.createDefaultListCardView(),
    ];
    const upNode = {
      ...node,
      view: { ...view, childrenViews } as IListCardCarouselView,
    };
    dispath(updateNode(upNode));
  };

  return (
    <Carousel nodeId={`${NODE_PREFIX}${node.id}`} addCarousel={HandleAddCarousel}>
      {view.childrenViews.map((v, index) => {
        return (
          <ListCardView
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

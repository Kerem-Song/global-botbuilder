import { Carousel } from '@components/pages/scenario/Carousel';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IListCardCarouselView, IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem, updateNode } from '@store/makingNode';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ListCardView } from '../views/ListCardView';

export const ListCardCarouselNode: FC<IHasNode> = ({ node }) => {
  const dispatch = useDispatch();
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
    dispatch(updateNode(upNode));
  };

  const deleteNode = (nodeId: string) => {
    dispatch(removeItem(nodeId));
    dispatch(setSelected());
  };

  useEffect(() => {
    if (!view.childrenViews?.length) {
      deleteNode(node.id);
    }
  }, [view.childrenViews]);

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

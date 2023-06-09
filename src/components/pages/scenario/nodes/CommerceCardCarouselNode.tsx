import { Carousel } from '@components/pages/scenario/Carousel';
import { INode } from '@models';
import {
  IProductCardCarouselView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem, updateNode } from '@store/makingNode';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { CommerceCardView } from '../views/CommerceCardView';

interface ICommerceCardCarouselNodeProps {
  node: INode;
}

export const CommerceCardCarouselNode: FC<ICommerceCardCarouselNodeProps> = ({
  node,
}) => {
  const dispatch = useDispatch();
  const view = node.view as IProductCardCarouselView;

  const HandleAddCarousel = () => {
    const useImageCtrl = view.useImageCtrl;
    const childrenViews: IProductCardView[] = [
      ...view.childrenViews,
      nodeDefaultHelper.createDefaultCommerceView(useImageCtrl),
    ];
    const upNode = {
      ...node,
      view: { ...view, childrenViews } as IProductCardCarouselView,
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

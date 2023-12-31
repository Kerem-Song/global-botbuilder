import { Carousel } from '@components/pages/scenario/Carousel';
import { IHasNode } from '@models/interfaces/IHasNode';
import {
  IBasicCardCarouselView,
  IBasicCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem, updateNode } from '@store/makingNode';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BasicCardView } from '../views/BasicCardView';

export const BasicCardCarouselNode: FC<IHasNode> = ({ node }) => {
  const dispatch = useDispatch();
  const view = node.view as IBasicCardCarouselView;

  const HandleAddCarousel = () => {
    const useImageCtrl = view.useImageCtrl;
    const aspectRatio = view.childrenViews[0].imageCtrl?.aspectRatio;
    const childrenViews: IBasicCardView[] = [
      ...view.childrenViews,
      nodeDefaultHelper.createDefaultBasicCardView(useImageCtrl, aspectRatio),
    ];

    const upNode = {
      ...node,
      view: { ...view, childrenViews } as IBasicCardCarouselView,
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
          <BasicCardView
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

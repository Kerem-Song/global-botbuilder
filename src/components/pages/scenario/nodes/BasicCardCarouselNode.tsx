import { Carousel } from '@components/pages/scenario/Carousel';
import { INode } from '@models';
import {
  IBasicCardCarouselView,
  IBasicCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected } from '@store/botbuilderSlice';
import { updateNode } from '@store/makingNode';
import { removeItem } from '@store/makingNode';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { NODE_PREFIX } from '../../../../modules';
import { BasicCardView } from '../views/BasicCardView';
export interface IBasicCardCarouselNodeProps {
  node: INode;
}

export const BasicCardCarouselNode: FC<IBasicCardCarouselNodeProps> = ({ node }) => {
  const dispatch = useDispatch();
  const view = node.view as IBasicCardCarouselView;

  const HandleAddCarousel = () => {
    const childrenViews: IBasicCardView[] = [
      ...view.childrenViews,
      nodeDefaultHelper.createDefaultBasicCardView(),
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

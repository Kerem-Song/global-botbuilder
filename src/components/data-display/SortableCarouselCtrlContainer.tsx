import { icCardDelete, icCardDuplication, icCardDuplicationDisabled } from '@assets';
import { IPopperItem, Popper } from '@components/navigation';
import { HistoryViewerMatch } from '@components/pages/history/HistoryViewerMatch';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { IChildrenViewEnum, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeHelper } from '@modules';
import { setSelected } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SortableCarouselCtrlItem } from './SortableCarouselCtrlItem';
import { SoratbleGrid } from './SortableGrid';
interface ISortableContainer {
  nodeView: IHasChildrenView;
  nodeId: string;
  carouselNode: IChildrenViewEnum;
  setCarouselNode: (node: IChildrenViewEnum) => void;
}

export const SoratbleCarouselCtrlContainer = ({
  nodeId,
  carouselNode,
  setCarouselNode,
}: ISortableContainer) => {
  const dispatch = useDispatch();
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // useEffect(() => {
  //   console.log('carouselnode lenght', carouselNode.length);
  //   if (carouselNode.length === 10) {
  //     setIsDisable(true);
  //   }
  // }, [carouselNode.length, setIsDisable]);
  // console.log('isDisable', isDisable);
  // console.log('caro num', carouselNode.length);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over?.id) return;

    if (active.id !== over.id && carouselNode) {
      const oldIndex = carouselNode.findIndex((item) => item.id === active.id);
      const newIndex = carouselNode.findIndex((item) => item.id === over.id);
      const sortedCarousel = arrayMove(carouselNode, oldIndex, newIndex);
      setCarouselNode(sortedCarousel);
    }
  };

  const handleDuplicationCard = (id: string, node: IChildrenViewEnum) => {
    const target = node.find((item) => item.id === id);

    if (target && carouselNode.length < 10) {
      const duplicated = nodeHelper.cloneView(target);
      setCarouselNode([...node, duplicated]);
    }
  };

  const handleDeleteCard = (id: string, node: IChildrenViewEnum) => {
    const target = node.findIndex((item) => item.id === id);

    if (target >= 0) {
      setCarouselNode(node.filter((item) => item.id !== id));
    }
  };

  const contextMenu: IPopperItem<{
    action: ((id: string, node: IChildrenViewEnum) => void) | null;
  }>[] = [
    {
      id: 'duplicate-carousel',
      name: 'Duplication',
      type: 'icon-front',
      icon: carouselNode.length < 10 ? icCardDuplication : icCardDuplicationDisabled,
      data: {
        action: handleDuplicationCard,
      },
    },
    {
      id: 'delete-carosel',
      name: 'Delete',
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        action: handleDeleteCard,
      },
    },
  ];

  return (
    <DndContext
      onDragEnd={(e) => handleDragEnd(e)}
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToParentElement]}
    >
      {carouselNode && (
        <SortableContext items={carouselNode}>
          <SoratbleGrid columns={5}>
            {carouselNode?.map((item, i: number) => (
              <Popper
                className="onContextMenu"
                placement="right"
                offset={[0, -100]}
                popup
                popupList
                popperItems={contextMenu}
                onChange={(m) => {
                  m.data?.action?.(item.id, carouselNode);
                }}
                key={i}
                disabled={HistoryViewerMatch()}
              >
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  <SortableCarouselCtrlItem
                    key={item.id}
                    typeName={item.typeName}
                    nodeId={nodeId}
                    id={item.id}
                    item={item}
                  />
                </div>
              </Popper>
            ))}
          </SoratbleGrid>
        </SortableContext>
      )}
    </DndContext>
  );
};

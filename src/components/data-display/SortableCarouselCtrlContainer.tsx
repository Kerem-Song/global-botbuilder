import { icCardDelete, icCardDuplication } from '@assets';
import { IPopperItem, Popper } from '@components/navigation';
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
import { useOutsideClick } from '@hooks/useOutsideClick';
import {
  IBasicCardView,
  IChildrenViewEnum,
  IHasChildrenView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { ID_GEN, ID_TYPES, nodeHelper } from '@modules';
import { useEffect, useRef, useState } from 'react';

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
    console.log('duplicate');
    const target = node.find((item) => item.id === id);
    console.log('target', target);
    if (target) {
      const test = nodeHelper.cloneView(target);
      console.log('test', test);
    }
    // setCarouselNode([...carouselNode]);
  };

  const handleDeleteCard = (id: string, node: IChildrenViewEnum) => {
    const target = node.findIndex((item) => item.id === id);

    if (target) {
      setCarouselNode(node.filter((item) => item.id !== id));
    }
  };

  const contextMenu: IPopperItem<{
    action: (id: string, node: IChildrenViewEnum) => void;
  }>[] = [
    {
      id: 'duplicate-carousel',
      name: 'Duplication',
      type: 'icon-front',
      icon: icCardDuplication,
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

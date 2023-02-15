import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  IBasicCardView,
  IHasChildrenView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SortableCarouselCtrlItem } from './SortableCarouselCtrlItem';
import { SoratbleGrid } from './SortableGrid';

interface ISortableContainer {
  nodeView: IHasChildrenView;
  nodeId: string;
  carouselNode: (IBasicCardView | IListCardView | IProductCardView)[];
  setCarouselNode: (node: (IBasicCardView | IListCardView | IProductCardView)[]) => void;
}

export const SoratbleCarouselCtrlContainer = ({
  nodeView,
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

  console.log('carousel node', carouselNode);
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
              <SortableCarouselCtrlItem
                key={item.id}
                typeName={item.typeName}
                nodeId={nodeId}
                id={item.id}
                item={item}
              />
            ))}
          </SoratbleGrid>
        </SortableContext>
      )}
    </DndContext>
  );
};

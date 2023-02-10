import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { IBasicCardView, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';

import { SortableCarouselCtrlItem } from './SortableCarouselCtrlItem';
import { SoratbleGrid } from './SortableGrid';

interface ISortableContainer {
  // node?:
  nodeView: IHasChildrenView;
  nodeId: string;
}

export const SoratbleCarouselCtrlContainer = ({
  nodeView,
  nodeId,
}: ISortableContainer) => {
  const [carouselNode, setCarouselNode] = useState<IBasicCardView[]>();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    setCarouselNode(nodeView.childrenViews || []);
  }, [nodeView.childrenViews]);

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

  function handleDragStart(e: DragEndEvent) {
    const { active } = e;
    setActiveId(active.id);
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over?.id) return;

    if (active.id !== over.id && nodeView.childrenViews) {
      setCarouselNode((items) => {
        if (items) {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          console.log('old index', oldIndex), console.log('new index', newIndex);
          return arrayMove(items, oldIndex, newIndex);
        }
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      onDragEnd={(e) => handleDragEnd(e)}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToParentElement]}
    >
      {nodeView.childrenViews && (
        <SortableContext items={nodeView.childrenViews}>
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

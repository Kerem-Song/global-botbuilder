import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { IButtonType } from '@models';
import { useState } from 'react';

import { SortableButtonItem } from './SortableButtonItem';
interface ISortableContainer {
  cardId: number;
  cardButtons: IButtonType[];
}
export const SortableButtonContainer = ({ cardId, cardButtons }: ISortableContainer) => {
  const [buttons, setButtons] = useState(cardButtons);
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

    if (active.id !== over.id) {
      setButtons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={buttons} strategy={rectSortingStrategy}>
        {buttons.map((item) => (
          <SortableButtonItem
            key={item.id}
            cardId={cardId}
            id={item.id}
            label={item.label}
            action={item.action}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

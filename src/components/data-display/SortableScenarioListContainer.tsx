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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IScenarioModel } from '@models';
import { useState } from 'react';

import { SortableScenarioListItem } from './SortableScenarioListItem';

interface ISortableContainer {
  scenarioList?: IScenarioModel[];
}

export const SortableScenarioListContainer = ({ scenarioList }: ISortableContainer) => {
  const [list, setList] = useState(scenarioList);

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

    if (active.id !== over.id && list) {
      setList((items) => {
        if (items) {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        }
      });
    }
  };

  return (
    <DndContext
      onDragEnd={(e) => handleDragEnd(e)}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
    >
      {list && (
        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map((item) => (
            <SortableScenarioListItem key={item.id} item={item} />
          ))}
        </SortableContext>
      )}
    </DndContext>
  );
};

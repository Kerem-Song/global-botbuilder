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
import { useScenarioClient } from '@hooks';
import { IScenarioModel } from '@models';
import { useEffect, useState } from 'react';
import React from 'react';

import { SortableScenarioListItem } from './SortableScenarioListItem';

interface ISortableContainer {
  scenarioList?: IScenarioModel[];
  disabled?: boolean;
}

export const SortableScenarioListContainer = React.memo(
  ({ scenarioList, disabled }: ISortableContainer) => {
    const [list, setList] = useState<IScenarioModel[]>();
    const { scenarioSortAsync } = useScenarioClient();
    useEffect(() => {
      setList(scenarioList);

      // 메모리 관리
      return () => {
        setList([]);
      };
    }, [scenarioList]);

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
        const oldIndex = list.findIndex((item) => item.id === active.id);
        const newIndex = list.findIndex((item) => item.id === over.id);
        const sortedList = arrayMove(list, oldIndex, newIndex);
        setList(sortedList);
        scenarioSortAsync(sortedList);
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
          <SortableContext
            items={list}
            strategy={verticalListSortingStrategy}
            disabled={disabled} // 데모시연을 위해서 잠시 주석처리
            // disabled={true}
          >
            {list.map((item) => (
              <SortableScenarioListItem key={item.id} item={item} />
            ))}
          </SortableContext>
        )}
      </DndContext>
    );
  },
);

SortableScenarioListContainer.displayName = 'SortableScenarioListContainer';

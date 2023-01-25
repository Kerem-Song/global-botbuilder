import { Col, Row } from '@components/layout';
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
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IButtonType } from '@models';
import { ACTION_TYPES, IQuickItem } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';

import { NextNodeButton } from './NextNodeButton';
import { SortableButtonItem } from './SortableButtonItem';
import { SortableQuickButtonItem } from './SortableQuickButtonItem';
interface ISortableContainer {
  nodeId: string;
  cardId: number;
  quickButtons?: IQuickItem[];
}
export const SortableQuickButtonContainer = ({
  nodeId,
  cardId,
  quickButtons: quickButtons,
}: ISortableContainer) => {
  const { updateLine } = useUpdateLines();
  const [buttons, setButtons] = useState<IQuickItem[]>([]);

  useEffect(() => {
    setButtons(quickButtons || []);
  }, [quickButtons]);

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

    updateLine(nodeId);
  };

  return (
    <Row justify="flex-start" align="flex-start">
      <Col span={22}>
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={buttons} strategy={rectSortingStrategy}>
            {buttons.map((item) => (
              <SortableQuickButtonItem
                key={item.id}
                nodeId={nodeId}
                cardId={cardId}
                id={item.id}
                label={item.label}
                actionType={item.actionType}
                seq={item.seq}
                typeName={item.typeName}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Col>
      <Col span={2}>
        {buttons.map(
          (item, i) =>
            item.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && (
              <div className="nextNodeWrapper" key={i}>
                <NextNodeButton
                  ctrlId={`${item.id}`}
                  nodeId={nodeId}
                  type="blue"
                  key={`card-${cardId}-button-${item.id}-nodeButton-${item.id}`}
                  offset={i * 40 + 66}
                />
              </div>
            ),
        )}
      </Col>
    </Row>
  );
};

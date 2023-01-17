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
import { IAnswerNode, IButtonType } from '@models';
import { useEffect, useState } from 'react';

import { NextNodeButton } from './NextNodeButton';
import { SortableButtonItem } from './SortableButtonItem';
interface ISortableContainer {
  nodeId: string;
  cardId: number;
  cardButtons: IButtonType[];
}
export const SortableButtonContainer = ({
  nodeId,
  cardId,
  cardButtons,
}: ISortableContainer) => {
  const { updateLine } = useUpdateLines();
  console.log(cardButtons);
  const [buttons, setButtons] = useState<IButtonType[]>([]);

  useEffect(() => {
    setButtons(cardButtons);
  }, [cardButtons]);

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
              <SortableButtonItem
                key={item.id}
                nodeId={nodeId}
                cardId={cardId}
                id={item.id}
                label={item.label}
                action={item.action}
                type={item.type}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Col>
      <Col span={2}>
        {buttons.map(
          (item, i) =>
            item.action !== 'linkWebUrl' && (
              <div className="nextNodeWrapper" key={i}>
                <NextNodeButton
                  ctrlId={`${item.id}`}
                  nodeId={nodeId}
                  type="blue"
                  key={`card-${cardId}-button-${item.id}-nodeButton-${item.id}`}
                  offset={item.type === 'AnswerNode' ? i * 40 + 66 : undefined}
                />
              </div>
            ),
        )}
      </Col>
    </Row>
  );
};

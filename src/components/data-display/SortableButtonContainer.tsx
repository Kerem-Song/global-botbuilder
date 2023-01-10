import { Button } from '@components/general';
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
import { IButtonType } from '@models';
import { useEffect, useState } from 'react';

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

  const handleBlueNodeBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    console.log('a');
  }, [handleDragEnd]);

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
              />
            ))}
          </SortableContext>
        </DndContext>
      </Col>
      <Col span={2}>
        {buttons.map(
          (item) =>
            item.action !== 'linkWebUrl' && (
              <div className="nextNodeWrapper" id={`next-${item.id}`}>
                <Button
                  key={`card-${cardId}-button-${item.id}-nodeButton-${item.id}`}
                  className="nextNode blue"
                  shape="ghost"
                  onClick={(e) => {
                    handleBlueNodeBtn(e);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </div>
            ),
        )}
      </Col>
    </Row>
  );
};

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
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IButtonType } from '@models';
import { setGuideStartNode } from '@store/botbuilderSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const { updateLine } = useUpdateLines();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
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

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const guide = document.querySelector<HTMLDivElement>('#icGuide');
    if (guide) {
      const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
      const cr = canvas?.getBoundingClientRect() || new DOMRect();
      const newPosition = {
        x: e.clientX / scale - cr.x - 11,
        y: e.clientY / scale - cr.y - 12,
      };
      guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </Col>
      <Col span={2}>
        {buttons.map(
          (item) =>
            item.action !== 'linkWebUrl' && (
              <div
                role="presentation"
                className="nextNodeWrapper"
                id={`next-${item.id}`}
                draggable
                onDragStart={(e) => {
                  const img = new Image();
                  e.dataTransfer.setData('id', `next-${item.id}`);
                  e.dataTransfer.setData('nodeId', nodeId);
                  e.dataTransfer.setData('isNext', '1');
                  dispatch(
                    setGuideStartNode({
                      startId: `next-${item.id}`,
                      nodeId,
                      isNext: true,
                    }),
                  );
                  e.dataTransfer.setDragImage(img, 0, 0);
                }}
                onDragEnd={(e) => {
                  dispatch(setGuideStartNode());
                }}
                onDrag={handleBottomDrag}
                onMouseDown={(e) => e.stopPropagation()}
              >
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

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
import { ACTION_TYPES, IButtonCtrl } from '@models/interfaces/res/IGetFlowRes';
import { updateButtonOrder } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { NextNodeButton } from './NextNodeButton';
import { SortableButtonCtrlItem } from './SortableButtonCtrlItem';

interface ISortableButtonCtrlContainerProps {
  nodeId: string;
  index?: number;
  nextNodeOffset?: number;
  buttonList?: IButtonCtrl[];
  isQuicks?: boolean;
}
export const SortableButtonCtrlContainer = ({
  nodeId,
  index,
  nextNodeOffset,
  buttonList,
  isQuicks,
}: ISortableButtonCtrlContainerProps) => {
  const dispath = useDispatch();
  const { updateLine } = useUpdateLines();
  const [buttons, setButtons] = useState<IButtonCtrl[]>([]);
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  useEffect(() => {
    setButtons(buttonList || []);
  }, [buttonList]);

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
        const result = arrayMove(items, oldIndex, newIndex);
        dispath(
          updateButtonOrder({
            nodeId: nodeId.substring(5),
            buttons: result,
            carouselIndex: index,
            isQuicks,
          }),
        );
        return result;
      });
    }

    updateLine(nodeId);
  };

  return (
    <Row justify="flex-start" align="flex-start">
      <Col span={22} className="sortableBtn">
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={buttons}
            strategy={rectSortingStrategy}
            disabled={isEditDrawerOpen}
          >
            {buttons.map((item) => (
              <SortableButtonCtrlItem
                key={item.id}
                nodeId={nodeId}
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
                  key={`card-${nodeId}-button-${item.id}-nodeButton-${item.id}`}
                  offset={nextNodeOffset ? i * 40 + nextNodeOffset : undefined}
                />
              </div>
            ),
        )}
      </Col>
    </Row>
  );
};

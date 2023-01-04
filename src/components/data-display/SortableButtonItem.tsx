import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IButtonType } from '@models';
import React from 'react';

interface ISortableButtonItem extends IButtonType {
  cardId: number;
}
export const SortableButtonItem = ({
  id,
  label,
  action,
  cardId,
}: ISortableButtonItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleBlueNodeBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Row key={`card-${cardId}-button-${id}`}>
        <Col span={23}>
          <Button
            key={`card-${cardId}-button-${id}`}
            onClick={() => console.log('button')}
          >
            {label}
          </Button>
        </Col>
        <Col span={1} className="nextNodeWrapper">
          <Button
            key={`card-${cardId}-button-${id}-nodeButton-${id}`}
            className="nextNode blue"
            shape="ghost"
            onClick={(e) => {
              console.log('blueNode');
              handleBlueNodeBtn(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          ></Button>
        </Col>
      </Row>
    </div>
  );
};

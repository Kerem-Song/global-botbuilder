import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IButtonType } from '@models';

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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Row key={`card-${cardId}-button-${id}`}>
        <Col span={23}>
          <Button key={`card-${cardId}-button-${id}`}>{label}</Button>
        </Col>
        <Col span={1} className="nextNodeWrapper">
          <Button
            key={`card-${cardId}-button-${id}-nodeButton-${id}`}
            className="nextNode blue"
            shape="ghost"
            onClick={() => console.log('blueNode')}
          ></Button>
        </Col>
      </Row>
    </div>
  );
};

import { Col, Row } from '@components/layout';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ISortableListItem } from '@models';

export const SortableListItem = ({ item }: { item: ISortableListItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Row justify="flex-start" align="center">
        <Col span={6}>
          {item.thumbnail?.imageUrl ? (
            <img src={item.thumbnail.imageUrl} alt="itemThumbnail" />
          ) : (
            <div className="listItemThumbnailSkeleton"></div>
          )}
        </Col>
        <Col span={18} className="listItemsContent">
          {item.title ? (
            <p className="title">{item.title}</p>
          ) : (
            <p className="title empty">Enter Title</p>
          )}
          {item.description ? (
            <p className="description">{item.description}</p>
          ) : (
            <p className="description empty">Enter Content</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

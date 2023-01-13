import { Col, Row } from '@components/layout';
import { ISortableListItem } from '@models';

export const SortableListCardItem = ({ item }: { item: ISortableListItem }) => {
  return (
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
  );
};

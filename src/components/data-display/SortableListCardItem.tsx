import { Col, Row } from '@components/layout';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';

export const SortableListCardItem = ({ item }: { item: IListCardItem }) => {
  return (
    <Row justify="flex-start" align="center">
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
      <Col span={6}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="itemThumbnail" />
        ) : (
          <div className="listItemThumbnailSkeleton"></div>
        )}
      </Col>
    </Row>
  );
};

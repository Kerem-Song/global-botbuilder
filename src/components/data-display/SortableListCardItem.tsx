import { Col, Row } from '@components/layout';
import { useRootState } from '@hooks';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';

export const SortableListCardItem = ({ item }: { item: IListCardItem }) => {
  const token = useRootState((state) => state.botInfoReducer.token);

  return (
    <Row justify="flex-start" align="center" key={item.id}>
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
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/builderimage/forbuilder?origin=${
              item.imageUrl
            }&sessionToken=${token}`}
            alt="itemThumbnail"
          />
        ) : (
          <div className="listItemThumbnailSkeleton"></div>
        )}
      </Col>
    </Row>
  );
};

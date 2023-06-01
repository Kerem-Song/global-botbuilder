import { Col, Row } from '@components/layout';
import { usePage, useRootState } from '@hooks';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';
import { Suspense } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const SortableListCardItem = ({ item }: { item: IListCardItem }) => {
  const { t } = usePage();
  const token = useRootState((state) => state.botInfoReducer.token);
  const listItemImgSrc = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${item.imageUrl}&sessionToken=${token}`;
  return (
    <Row justify="flex-start" align="center" key={item.id}>
      <Col span={18} className="listItemsContent">
        {item.title ? (
          <p className="title">{item.title}</p>
        ) : (
          <p className="title empty">{t(`ENTER_TITLE`)}</p>
        )}
        {item.description ? (
          <p className="description">{item.description}</p>
        ) : (
          <p className="description empty">{t(`ENTER_CONTENT`)}</p>
        )}
      </Col>
      <Col span={6} className="listItemImgWrapper">
        <Suspense
          fallback={
            <ReactLoadingSkeleton width={48} height={48} baseColor="rgba(0,0,0,0.06)" />
          }
        >
          {item.imageUrl && listItemImgSrc ? (
            <img src={listItemImgSrc} alt="itemThumbnail" />
          ) : (
            <div className="listItemThumbnailSkeleton"></div>
          )}
        </Suspense>
      </Col>
    </Row>
  );
};

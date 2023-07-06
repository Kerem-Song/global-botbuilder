import { icImgNotFound } from '@assets';
import { Col, Row } from '@components/layout';
import { ImageWithToken } from '@components/pages/scenario/views/ImageWithToken';
import { usePage, useRootState } from '@hooks';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';
import { Suspense } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import MultiClamp from 'react-multi-clamp';

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
          <div className="listTitle">
            <MultiClamp clamp={2} ellipsis={'...'}>
              {item.title}
            </MultiClamp>
          </div>
        ) : (
          <p className="title empty">{t(`ENTER_TITLE`)}</p>
        )}
        {item.description ? (
          <div className="listDescription">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {item.description}
            </MultiClamp>
          </div>
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
            <img
              src={listItemImgSrc}
              alt="itemThumbnail"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = icImgNotFound;
                // e.currentTarget.className = 'imgNotFound';
              }}
            />
          ) : (
            <div className="listItemThumbnailSkeleton"></div>
          )}
        </Suspense>
      </Col>
    </Row>
  );
};

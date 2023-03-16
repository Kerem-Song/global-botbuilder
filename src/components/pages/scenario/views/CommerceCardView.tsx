import { Card } from '@components/data-display';
import { Divider } from '@components/layout';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { usePage } from '@hooks';
import { ImageAspectRatio } from '@models';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, useState } from 'react';
import MultiClamp from 'react-multi-clamp';

export interface ICommerceCardViewProps {
  nodeId: string;
  index?: number;
  view: IProductCardView;
}
export const CommerceCardView: FC<ICommerceCardViewProps> = ({ nodeId, index, view }) => {
  const discountPriceCss = classNames('discountPrice', { discounted: true });
  const { t } = usePage();

  const thumbnailClass = classNames('thumbnail', {
    square: view.imageCtrl?.aspectRatio === ImageAspectRatio.Square,
    textCard: false,
  });

  return (
    <Card onClick={() => console.log('card click')}>
      {view.useImageCtrl || view.imageCtrl?.imageUrl ? (
        <div className={thumbnailClass}>
          {view.imageCtrl.imageUrl ? (
            <img src={view.imageCtrl.imageUrl} alt="thumbnailImage" />
          ) : (
            <div className="skeleton"></div>
          )}
        </div>
      ) : null}

      {view.profileIconUrl ? (
        <>
          <div className="profile">
            {view.profileIconUrl ? (
              <img src={view.profileIconUrl} alt="profileImage" />
            ) : (
              <div className="skeleton"></div>
            )}
            {view.profileName ? (
              <span>{view.profileName}</span>
            ) : (
              <span className="empty">{t(`PRODUCT_NODE_SET_BRAND_NAME`)}</span>
            )}
          </div>
          <Divider className="commerceDivider" />
        </>
      ) : null}

      <div className="priceWrapper">
        {view.retailPrice !== view.salePrice && (
          <div>
            <span className="discounted">
              {view.retailPrice && view.retailPrice.toLocaleString()}
            </span>
            <span className="discount">
              {view.discountPrice
                ? view.discountPrice.toLocaleString()
                : (view.retailPrice - view.salePrice).toLocaleString()}
              <span className="currency">{view.currencyUnit}</span>
              {t(`PRODUCT_NODE_DISCOUNT`)}
            </span>
          </div>
        )}
        <div className="prices">
          <p>
            {view.salePrice && view.salePrice.toLocaleString()}
            <span className="currency">{view.currencyUnit}</span>
          </p>
        </div>
      </div>

      {view.description !== undefined ? (
        <div className={classNames('productName', { empty: view.description })}>
          {view.description ? (
            <MultiClamp clamp={2}>{view.description}</MultiClamp>
          ) : (
            <p>{t(`PRODUCT_NODE_SET_PRODUCT_NAME`)}</p>
          )}
        </div>
      ) : null}

      <div className="buttonWrapper node-draggable-ignore">
        {view.buttons && (
          <SortableButtonCtrlContainer
            buttonList={view.buttons}
            nodeId={nodeId}
            index={index}
          />
        )}
      </div>
    </Card>
  );
};

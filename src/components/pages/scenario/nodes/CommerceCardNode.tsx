import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { SortableButtonCtrlContainer } from '@components/data-display/SortableButtonCtrlContainer';
import { Divider } from '@components/layout/Divider';
import { INode } from '@models';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, useState } from 'react';

interface ICommerceCardNodeProps {
  node: INode;
}

export const CommerceCardNode: FC<ICommerceCardNodeProps> = ({ node }) => {
  const view = node.view as IProductCardView;

  const discountPriceCss = classNames('discountPrice', { discounted: true });
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
  });

  return (
    <Card onClick={() => console.log('card click')}>
      {view.imageCtrl ? (
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
              <span className="empty">Enter Brand Name</span>
            )}
          </div>
          <Divider className="commerceDivider" />
        </>
      ) : null}

      <div className="priceWrapper">
        {view.retailPrice !== view.salePrice && (
          <div>
            <span className="discounted">{view.retailPrice}</span>
            <span className="discount">
              {view.retailPrice - view.salePrice}{' '}
              <span className="currency">{view.currencyUnit}</span> Discount
            </span>
          </div>
        )}
        <div className="prices">
          <p>
            {view.salePrice}
            <span className="currency">{view.currencyUnit}</span>
          </p>
        </div>
      </div>

      {view.description !== undefined ? (
        <div className={classNames('productName', { empty: view.description })}>
          {view.description ? <p>{view.description}</p> : <p>Enter Product Name</p>}
        </div>
      ) : null}

      <div className="buttonWrapper node-draggable-ignore">
        {view.buttons && (
          <SortableButtonCtrlContainer buttonList={view.buttons} nodeId={node.id} />
        )}
      </div>
    </Card>
  );
};

import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IDataProductCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { SortableButtonCtrlContainer } from '../SortableButtonCtrlContainer';

export const DataProductCardNode: FC<IHasNode> = ({ node }) => {
  const view: IDataProductCardView = node.view as IDataProductCardView;
  const { t } = usePage();

  return (
    <Card>
      <div className="countConditionWrapper">
        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            attribute: {view.itemsRefName}
          </MultiClamp>
        </span>
        <br />

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            carousel: {view.count}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            print: {view.isShuffle}
          </MultiClamp>
        </span>
        <br />

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            image: {view.imageCtrl?.imageUrl ? 'Y' : 'N'}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            image value: {view.imageCtrl?.imageUrl}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            image type:
            {view.imageCtrl?.aspectRatio
              ? t(`IMAGE_TYPE_SQUARE`)
              : t(`IMAGE_TYPE_RECTANGLE`)}
          </MultiClamp>
        </span>
        <br />

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            profile image: {view.profileIconUrl}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            shop name: {view.profileName}
          </MultiClamp>
        </span>
        <br />

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            price: {view.retailPriceParam}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            discount: {view.salePriceParam}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={1} ellipsis={'...'}>
            description: {view.description}
          </MultiClamp>
        </span>
      </div>
      <div className="buttonWrapper node-draggable-ignore">
        {view.buttons && (
          <SortableButtonCtrlContainer
            buttonList={view.buttons}
            nodeId={`${NODE_PREFIX}${node.id}`}
          />
        )}
      </div>
    </Card>
  );
};

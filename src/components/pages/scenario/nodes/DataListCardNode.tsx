import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IDataListCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { SortableButtonCtrlContainer } from '../SortableButtonCtrlContainer';

export const DataListCardNode: FC<IHasNode> = ({ node }) => {
  const view: IDataListCardView = node.view as IDataListCardView;
  const { t } = usePage();

  return (
    <Card>
      <div className="countConditionWrapper">
        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            attribute: {view.attribute}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            carousel: {view.carousel}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            print: {view.print}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            headline: {view.header}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            image: {view.imageCtrl?.imageUrl ? 'Y' : 'N'}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            image value: {view.imageCtrl?.imageUrl}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            image type:
            {view.imageCtrl?.aspectRatio
              ? t(`IMAGE_TYPE_SQUARE`)
              : t(`IMAGE_TYPE_RECTANGLE`)}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            title: {view.items[0].title}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            description: {view.items[0].description}
          </MultiClamp>
        </span>

        <span className="dataCardDesc">
          <MultiClamp clamp={2} ellipsis={'...'}>
            list image: {view.items[0].imageUrl}
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

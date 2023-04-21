import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IDataBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { SortableButtonCtrlContainer } from '../SortableButtonCtrlContainer';

export const DataBasicCardNode: FC<IHasNode> = ({ node }) => {
  const view: IDataBasicCardView = node.view as IDataBasicCardView;
  const { t } = usePage();

  return (
    <Card>
      <div className="countConditionWrapper">
        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            attribute: {view.attribute}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            carousel: {view.carousel}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            print: {view.print}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            image: {view.useImageCtrl ? 'Y' : 'N'}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            image value: {view.imageCtrl?.imageUrl}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            image type:
            {view.imageCtrl?.aspectRatio
              ? t(`IMAGE_TYPE_SQUARE`)
              : t(`IMAGE_TYPE_RECTANGLE`)}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            title: {view.title}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
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

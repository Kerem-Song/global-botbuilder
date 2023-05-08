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
        <div className="dataCard">
          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`attribute: ${view.itemsRefName}`}
            </MultiClamp>
          </span>
          <br />

          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`carousel: ${view.count}`}
            </MultiClamp>
          </span>

          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`print: ${view.isShuffle}`}
            </MultiClamp>
          </span>

          <br />
          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`image: ${view.imageCtrl?.imageUrl ? 'Y' : 'N'}`}
            </MultiClamp>
          </span>

          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`image value: ${view.imageCtrl?.imageUrl}`}
            </MultiClamp>
          </span>

          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`image type:
              ${
                view.imageCtrl?.aspectRatio
                  ? t(`IMAGE_TYPE_SQUARE`)
                  : t(`IMAGE_TYPE_RECTANGLE`)
              }`}
            </MultiClamp>
          </span>

          <br />
          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`title: ${view.title}`}
            </MultiClamp>
          </span>

          <span className="dataCardDesc">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {`description: ${view.description}`}
            </MultiClamp>
          </span>
        </div>
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

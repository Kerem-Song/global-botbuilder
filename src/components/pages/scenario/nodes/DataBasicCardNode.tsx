import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IDataBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

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
            image: {view.useImageCtrl}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            image value: {view.imageCtrl?.imageUrl}
          </MultiClamp>
        </span>

        <span style={{ whiteSpace: 'pre-line' }}>
          <MultiClamp clamp={2} ellipsis={'...'}>
            image type: {view.imageCtrl?.aspectRatio}
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
    </Card>
  );
};

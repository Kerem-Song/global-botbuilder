import { Card } from '@components/data-display';
import { SortableButtonCtrlContainer } from '@components/data-display/SortableButtonCtrlContainer';
import { SortableListContainer } from '@components/data-display/SortableListContainer';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, useState } from 'react';

export interface IListCardViewProps {
  nodeId: string;
  view: IListCardView;
}
export const ListCardView: FC<IListCardViewProps> = ({ nodeId, view }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
    textCard: false,
  });

  return (
    <Card onClick={() => console.log('card click')}>
      {view.header ? (
        <div
          className={classNames('title list', {
            empty: !view.header,
          })}
        >
          {view.header ? <p>{view.header}</p> : <p>Enter Head Title</p>}
        </div>
      ) : null}
      {view.imageCtrl ? (
        <div className={thumbnailClass}>
          {view.imageCtrl.imageUrl ? (
            <img src={view.imageCtrl.imageUrl} alt="thumbnailImage" />
          ) : (
            <div className="skeleton"></div>
          )}
        </div>
      ) : null}

      {view.items && view.items.length < 6 ? (
        <div className={'node-draggable-ignore'}>
          {view.items && <SortableListContainer listItems={view.items} />}
        </div>
      ) : null}
      <div className="buttonWrapper list node-draggable-ignore">
        {view.buttons && (
          <SortableButtonCtrlContainer buttonList={view.buttons} nodeId={nodeId} />
        )}
      </div>
    </Card>
  );
};

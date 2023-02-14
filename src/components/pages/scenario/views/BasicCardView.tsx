import { Card } from '@components/data-display';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, useState } from 'react';

export interface IBasicCardViewProps {
  nodeId: string;
  view: IBasicCardView;
}
export const BasicCardView: FC<IBasicCardViewProps> = ({ nodeId, view }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
    textCard: false,
  });

  return (
    <Card>
      {view.imageCtrl ? (
        <div
          className={classNames(
            'thumbnail',
            view.title === undefined &&
              view.buttons === undefined &&
              view.description === undefined
              ? 'round'
              : '',
          )}
        >
          {view.imageCtrl.imageUrl ? (
            <img src={view.imageCtrl.imageUrl} alt="thumbnailImage" />
          ) : (
            <div className="skeleton"></div>
          )}
        </div>
      ) : (
        <div className={classNames(thumbnailClass, { textCard: true })}></div>
      )}

      <div
        className={classNames('title', {
          none: view.title === undefined,
          empty: view.title === '',
        })}
      >
        {view.title ? <p>{view.title}</p> : <p>Enter Title</p>}
      </div>

      <div
        className={classNames('description', {
          none: view.description === undefined,
          empty: view.description === '',
        })}
      >
        {view.description ? <p>{view.description}</p> : <p>Enter Content</p>}
      </div>

      <div className="buttonWrapper node-draggable-ignore">
        {view.buttons && (
          <SortableButtonCtrlContainer buttonList={view.buttons} nodeId={nodeId} />
        )}
      </div>
    </Card>
  );
};

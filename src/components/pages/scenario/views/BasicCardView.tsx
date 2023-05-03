import { Card } from '@components/data-display';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { useRootState } from '@hooks';
import { ImageAspectRatio } from '@models';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, useState } from 'react';
import MultiClamp from 'react-multi-clamp';

export interface IBasicCardViewProps {
  nodeId: string;
  index?: number;
  view: IBasicCardView;
}
export const BasicCardView: FC<IBasicCardViewProps> = ({ nodeId, index, view }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);

  const thumbnailClass = classNames('thumbnail', {
    square: view.imageCtrl?.aspectRatio === ImageAspectRatio.Square,
    textCard: false,
  });

  const token = useRootState((state) => state.botInfoReducer.token);

  return (
    <Card>
      {view.imageCtrl?.imageUrl || view.useImageCtrl ? (
        <div
          className={classNames(
            'thumbnail',
            view.title === undefined &&
              view.buttons === undefined &&
              view.description === undefined
              ? 'round'
              : '',
            thumbnailClass,
          )}
        >
          {view.imageCtrl?.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/builderimage/forbuilder?origin=${
                view.imageCtrl.imageUrl
              }&sessionToken=${token}`}
              alt="thumbnailImage"
            />
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
        {view.title ? (
          <MultiClamp clamp={2}>{view.title}</MultiClamp>
        ) : (
          <p>Enter Title</p>
        )}
      </div>

      <div
        className={classNames('description', {
          none: view.description === undefined,
          empty: view.description === '',
        })}
      >
        {view.description ? (
          <span style={{ whiteSpace: 'pre-line' }}>
            <MultiClamp clamp={2}>{view.description}</MultiClamp>
          </span>
        ) : (
          <p>Enter Content</p>
        )}
      </div>

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

import { Card } from '@components/data-display';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { usePage, useRootState } from '@hooks';
import { ImageAspectRatio } from '@models';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, Suspense, useState } from 'react';
import MultiClamp from 'react-multi-clamp';

export interface IBasicCardViewProps {
  nodeId: string;
  index?: number;
  view: IBasicCardView;
}
export const BasicCardView: FC<IBasicCardViewProps> = ({ nodeId, index, view }) => {
  const { t } = usePage();

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
            <Suspense fallback={<div>loading</div>}>
              <img
                src={`${
                  import.meta.env.VITE_API_BASE_URL
                }/builderimage/forbuilder?origin=${
                  view.imageCtrl.imageUrl
                }&sessionToken=${token}`}
                alt="thumbnailImage"
              />
            </Suspense>
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
          <p>{t(`ENTER_TITLE`)}</p>
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
          <p>{t(`ENTER_CONTENT`)}</p>
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

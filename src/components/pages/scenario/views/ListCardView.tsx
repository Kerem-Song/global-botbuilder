import { Card } from '@components/data-display';
import { SortableListContainer } from '@components/data-display/SortableListContainer';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { useRootState } from '@hooks';
import { ImageAspectRatio } from '@models';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC, lazy, Suspense, useState } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';
const ImageWithToken = lazy(() =>
  import('./ImageWithToken').then(({ ImageWithToken }) => ({ default: ImageWithToken })),
);
export interface IListCardViewProps {
  nodeId: string;
  index?: number;
  view: IListCardView;
}
export const ListCardView: FC<IListCardViewProps> = ({ nodeId, index, view }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: view.imageCtrl?.aspectRatio === ImageAspectRatio.Square,
    textCard: false,
  });
  const token = useRootState((state) => state.botInfoReducer.token);

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
      {view.imageCtrl?.imageUrl || view.useImageCtrl ? (
        <div className={thumbnailClass}>
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
          {/* <Suspense
            fallback={
              <ReactLoadingSkeleton
                width={192}
                height={96}
                baseColor="rgba(0,0,0,0.06)"
              />
            }
          >
            <ImageWithToken view={view} />
          </Suspense> */}
        </div>
      ) : null}

      {view.items && view.items.length < 6 ? (
        <div className={'node-draggable-ignore'}>
          {view.items && (
            <SortableListContainer listItems={view.items} nodeId={nodeId} index={index} />
          )}
        </div>
      ) : null}
      <div className="buttonWrapper list node-draggable-ignore">
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

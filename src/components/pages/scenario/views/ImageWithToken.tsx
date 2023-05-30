import { useRootState } from '@hooks';
import {
  IBasicCardView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';

export const ImageWithToken = ({
  view,
}: {
  view: IBasicCardView | IListCardView | IProductCardView;
}) => {
  const token = useRootState((state) => state.botInfoReducer.token);
  return (
    <>
      {view.imageCtrl?.imageUrl ? (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/builderimage/forbuilder?origin=${
            view.imageCtrl?.imageUrl
          }&sessionToken=${token}`}
          alt="thumbnailImage"
        />
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

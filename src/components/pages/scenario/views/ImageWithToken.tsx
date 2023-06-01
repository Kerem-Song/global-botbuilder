import { useHttp, useRootState } from '@hooks';
import { imageUploadClient } from '@hooks';
import {
  IBasicCardView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
export const ImageWithToken = ({ origin }: { origin?: string }) => {
  const token = useRootState((state) => state.botInfoReducer.token);

  const imageSource = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${origin}&sessionToken=${token}`;

  return (
    <>
      {origin && imageSource ? (
        <img src={imageSource} alt="thumbnailImage" />
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

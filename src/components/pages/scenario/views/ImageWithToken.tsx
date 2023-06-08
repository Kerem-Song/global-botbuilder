import { icImgNotFound } from '@assets';
import { useHttp, useRootState } from '@hooks';
import { imageUploadClient } from '@hooks';
import {
  IBasicCardView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';

export const ImageWithToken = ({ origin }: { origin?: string }) => {
  const token = useRootState((state) => state.botInfoReducer.token);

  const builderImageSrc = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${origin}&sessionToken=${token}`;

  return (
    <>
      {origin && builderImageSrc ? (
        <img
          src={builderImageSrc}
          alt="thumbnailImage"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = icImgNotFound;
            e.currentTarget.className = 'imgNotFound';
          }}
        />
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

import { icImgNotFound } from '@assets';
import { useRootState } from '@hooks';
import { useState } from 'react';

export const ImageWithToken = ({ origin }: { origin?: string }) => {
  const token = useRootState((state) => state.botInfoReducer.token);
  const [imgErr, setImgErr] = useState<boolean>(false);
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
            console.log('@err in img with token', e);
            setImgErr(true);
          }}
          onLoad={(e) => {
            if (imgErr && e.currentTarget.className === 'imgNotFound') {
              setImgErr(false);
              e.currentTarget.className = '';
            }
          }}
        />
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

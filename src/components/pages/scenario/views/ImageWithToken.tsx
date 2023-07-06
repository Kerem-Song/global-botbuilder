import { icImgNotFound } from '@assets';
import { usePage, useRootState } from '@hooks';
import { useEffect, useRef, useState } from 'react';

export const ImageWithToken = ({ origin }: { origin?: string }) => {
  const { t } = usePage();
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
            // e.currentTarget.className = 'imgNotFound';
            console.log('@err in img with token', e);
          }}
          crossOrigin="anonymous"
        />
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

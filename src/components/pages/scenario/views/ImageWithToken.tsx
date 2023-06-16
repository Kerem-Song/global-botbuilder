import { icImgNotFound } from '@assets';
import { usePage, useRootState } from '@hooks';
import { createElement, useRef } from 'react';

export const ImageWithToken = ({ origin }: { origin?: string }) => {
  const { t } = usePage();
  const token = useRootState((state) => state.botInfoReducer.token);

  const builderImageSrc = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${origin}&sessionToken=${token}`;

  const imgNotFoundTextRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      {origin && builderImageSrc ? (
        <>
          <img
            src={builderImageSrc}
            alt="thumbnailImage"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = icImgNotFound;
              e.currentTarget.className = 'imgNotFound';
              if (imgNotFoundTextRef.current) {
                imgNotFoundTextRef.current.innerHTML = `${t(`IMAGE_NOT_FOUND`)}`;
              }
            }}
          />
          <span ref={imgNotFoundTextRef}></span>
        </>
      ) : (
        <div className="skeleton"></div>
      )}
    </>
  );
};

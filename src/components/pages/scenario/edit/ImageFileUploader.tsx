import { icImg, icImgNotFound } from '@assets';
import { imageUploadClient, usePage, useRootState, useSystemModal } from '@hooks';
import { IImageCtrlIdPathProps, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { ID_TYPES } from '@modules';
import classnames from 'classnames';
import { SyntheticEvent, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { handleImageCtrlIdPath } from './handleImageCtrlIdPath';

export const ImageFileUploader = ({
  imageCtrl,
  index,
  listItemIndex,
  imageRatio,
  isValid,
}: IImageCtrlIdPathProps) => {
  const { t } = usePage();
  const {
    getValues,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useFormContext();

  const { imageUploadAsync } = imageUploadClient();
  const { error } = useSystemModal();

  const token = useRootState((state) => state.botInfoReducer.token);

  const memoizedHandleCtrlIdPath = useMemo(() => {
    const {
      imageCtrl: imgCtrl,
      imageCtrlPath,
      imageFilePath,
      imageUrl,
      htmlForId,
      imgPath,
    } = handleImageCtrlIdPath({
      imageCtrl,
      index,
      listItemIndex,
    });
    return {
      imgCtrl,
      imageCtrlPath,
      imageFilePath,
      imageUrl,
      htmlForId,
      imgPath,
    };
  }, [imageCtrl, index, listItemIndex]);

  const builderImageSrc = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${getValues(
    memoizedHandleCtrlIdPath.imageUrl,
  )}&sessionToken=${token}`;

  const handleImageCtrlId = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return ID_TYPES.PROFILE;

      case IMAGE_CTRL_TYPES.IMAGE_CTRL:
        return memoizedHandleCtrlIdPath.imgCtrl?.id;
      default:
        return memoizedHandleCtrlIdPath.imgCtrl?.id;
    }
  };

  const handleUploadImage = async () => {
    if (token && getValues(memoizedHandleCtrlIdPath.imageFilePath).length > 0) {
      const formData = new FormData();
      formData.append('File', getValues(memoizedHandleCtrlIdPath.imageFilePath)[0]);
      formData.append('SessionToken', token);
      formData.append('CtrlId', handleImageCtrlId());

      await imageUploadAsync({ formData })
        .then((res) => {
          setValue(memoizedHandleCtrlIdPath.imageUrl, res?.data.result, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue(memoizedHandleCtrlIdPath.imageFilePath, null, { shouldDirty: true });
          setValue(memoizedHandleCtrlIdPath.imgPath, null, { shouldDirty: true });
        })
        .catch((err) => {
          setValue(memoizedHandleCtrlIdPath.imageUrl, null, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue(memoizedHandleCtrlIdPath.imageFilePath, null, { shouldDirty: true });
          setValue(memoizedHandleCtrlIdPath.imgPath, null, { shouldDirty: true });
          //modal 띄우기?
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const FILE_SIZE = 3 * 1024 * 1024; //3mb제한
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']; //jpg, png가능
    if (e.target.files) {
      if (!SUPPORTED_FORMATS.includes(e.target.files[0]?.type)) {
        await error({
          title: t(`VALIDATION_FILE_TYPE_TITLE`),
          description: t(`VALIDATION_FILE_TYPE`),
        });
        return;
      } else if (e.target.files[0].size > FILE_SIZE) {
        e.target.files = null;
        e.target.value = '';
        await error({
          title: t(`VALIDATION_FILE_SIZE_TITLE`),
          description: t(`VALIDATION_FILE_SIZE`),
        });

        return;
      }
      setValue(memoizedHandleCtrlIdPath.imageFilePath, e.target.files, {
        shouldDirty: true,
      });
    }
  };

  const handleImgOnError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = icImgNotFound;
  };

  useEffect(() => {
    if (token && !!getValues(memoizedHandleCtrlIdPath.imageFilePath)) {
      handleUploadImage();
    }
  }, [watch(memoizedHandleCtrlIdPath.imageFilePath)]);

  return (
    <>
      <label
        htmlFor={memoizedHandleCtrlIdPath.htmlForId}
        className={classnames('imgUploadLabel', {
          skeleton: !getValues(memoizedHandleCtrlIdPath.imageUrl),
        })}
      >
        <div
          className={classnames(`imgUploadWrapper`, {
            small:
              imageCtrl === IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL ||
              imageCtrl === IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL ||
              imageCtrl === IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL ||
              imageCtrl === IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL,
            rectangle: imageRatio === ImageAspectRatio.Rectangle,
            invalid: !isValid,
          })}
        >
          <div className={classnames('imgUploadSkeleton')}>
            {watch(memoizedHandleCtrlIdPath.imageUrl) ? (
              watch(memoizedHandleCtrlIdPath.imgPath) ? (
                <>
                  <img
                    src={watch(memoizedHandleCtrlIdPath.imgPath)}
                    alt="templateImage"
                    onError={(e) => {
                      handleImgOnError(e);
                    }}
                    // onLoad={(e) => {
                    //   if (
                    //     !Object.keys(errors).length &&
                    //     e.currentTarget.className === 'imgNotFound'
                    //   ) {
                    //     e.currentTarget.className = '';
                    //   }
                    // }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={builderImageSrc}
                    alt="templateImage"
                    onError={(e) => {
                      handleImgOnError(e);
                    }}
                    // onLoad={(e) => {
                    //   if (
                    //     !Object.keys(errors).length &&
                    //     e.currentTarget.className === 'imgNotFound'
                    //   ) {
                    //     e.currentTarget.className = '';
                    //   }
                    // }}
                  />
                </>
              )
            ) : (
              <>
                <img src={icImg} alt="icImg" />
                {(imageCtrl === IMAGE_CTRL_TYPES.IMAGE_CTRL ||
                  imageCtrl === IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL) && (
                  <>
                    <p>{t(`RECOMMENDED_SIZE`)}</p>
                    <p>
                      {imageRatio === ImageAspectRatio.Rectangle
                        ? t(`IMAGE_TYPE_RECTANGLE`) + ' : 800 x 400'
                        : t(`IMAGE_TYPE_SQUARE`) + ' : 800 x 800'}
                    </p>
                  </>
                )}
              </>
            )}

            <input
              type="file"
              id={memoizedHandleCtrlIdPath.htmlForId}
              accept="image/png, image/jpeg, image/jpg"
              className="file-name-input"
              onChange={handleChangeFile}
              style={{ display: 'none' }}
              autoComplete="off"
            />
          </div>
        </div>
      </label>
    </>
  );
};

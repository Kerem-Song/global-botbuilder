import { icImg, icImgNotFound } from '@assets';
import {
  imageUploadClient,
  useHttp,
  usePage,
  useRootState,
  useSystemModal,
} from '@hooks';
import { IImageCtrlIdPathProps, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { ID_TYPES, SYS_BOT_ICON } from '@modules';
import classnames from 'classnames';
import { SyntheticEvent, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';

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

  const values = getValues();

  const { imageUploadAsync } = imageUploadClient();
  const { error, info } = useSystemModal();

  const token = useRootState((state) => state.botInfoReducer.token);
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const botImg = botInfo?.iconUrl;

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

  const builderImageSrc = `${
    import.meta.env.VITE_API_BASE_URL
  }/builderimage/forbuilder?origin=${getValues(imageUrl)}&sessionToken=${token}`;

  const handleImageCtrlId = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return ID_TYPES.PROFILE;

      case IMAGE_CTRL_TYPES.IMAGE_CTRL:
        return imgCtrl?.id;
      default:
        return imgCtrl?.id;
    }
  };

  const handleUploadImage = async () => {
    if (token && getValues(imageFilePath).length > 0) {
      const formData = new FormData();
      formData.append('File', getValues(imageFilePath)[0]);
      formData.append('SessionToken', token);
      formData.append('CtrlId', handleImageCtrlId());

      imageUploadAsync({ formData })
        .then((res) => {
          console.log('res.data image', res?.data);
          setValue(imageUrl, res?.data.result);
          setValue(imageFilePath, null);
        })
        .catch((err) => {
          setValue(imageUrl, null);
          setValue(imageFilePath, null);

          //modal 띄우기?
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const FILE_SIZE = 3.2 * 1000 * 1000; //3mb제한
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
      setValue(imageFilePath, e.target.files);
    }
  };

  const handleImgOnError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = icImgNotFound;
    e.currentTarget.className = 'imgNotFound';
    setError(imageUrl, { type: 'custom', message: t(`IMAGE_NOT_FOUND`) });
  };

  useEffect(() => {
    if (token && !!getValues(imageFilePath)) {
      handleUploadImage();
    }
  }, [watch(imageFilePath)]);

  return (
    <>
      <label
        htmlFor={htmlForId}
        className={classnames('imgUploadLabel', {
          skeleton: !getValues(imageUrl),
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
            {watch(imageUrl) ? (
              watch(imgPath) ? (
                <img
                  src={watch(imgPath)}
                  alt="templateImage"
                  onError={(e) => {
                    handleImgOnError(e);
                  }}
                  onLoad={(e) => {
                    console.log('@errors1', errors);
                    console.log('@onload1 ', isValid, e.currentTarget.className);
                    if (
                      !Object.keys(errors).length &&
                      e.currentTarget.className === 'imgNotFound'
                    ) {
                      e.currentTarget.className = '';
                    }
                  }}
                />
              ) : (
                <img
                  src={builderImageSrc}
                  alt="templateImage"
                  onError={(e) => {
                    handleImgOnError(e);
                  }}
                  onLoad={(e) => {
                    console.log('@errors2', errors);
                    console.log('@isvalid2 ', isValid, e.currentTarget.className);
                    if (
                      !Object.keys(errors).length &&
                      e.currentTarget.className === 'imgNotFound'
                    ) {
                      e.currentTarget.className = '';
                    }
                  }}
                />
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
              id={htmlForId}
              accept="image/png, image/jpeg, image/jpg"
              className="file-name-input"
              onChange={handleChangeFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </label>
    </>
  );
};

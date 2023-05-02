import { icImg } from '@assets';
import { imageUploadClient, usePage, useRootState, useSystemModal } from '@hooks';
import { IImageCtrlIdPathProps, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { ID_TYPES } from '@modules';
import classnames from 'classnames';
import { useEffect } from 'react';
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
    formState: { errors },
  } = useFormContext();
  const values = getValues();

  const { imageUploadAsync } = imageUploadClient();
  const { error, info } = useSystemModal();

  const token = useRootState((state) => state.botInfoReducer.token);

  // const handleImageCtrlIdPath = () => {
  //   switch (imageCtrl) {
  //     case IMAGE_CTRL_TYPES.IMAGE_CTRL:
  //       return {
  //         imageCtrl: values.view.imageCtrl,
  //         imageFilePath: 'view.imageCtrl.imageFile',
  //         imageUrl: 'view.imageCtrl.imageUrl',
  //         htmlForId: 'imgUpload',
  //       };

  //     case IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL:
  //       return {
  //         imageCtrl: values.view.items?.[listItemIndex!],
  //         imageFilePath: `view.items.${listItemIndex}.imageFile`,
  //         imageUrl: `view.items.${listItemIndex}.imageUrl`,
  //         htmlForId: `smallImgUpload-${listItemIndex}`,
  //       };

  //     case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
  //       return {
  //         imageCtrl: values.view.childrenViews[index!]?.imageCtrl,
  //         imageFilePath: `view.childrenViews.${index}.imageFile`,
  //         imageUrl: `view.childrenViews.${index}.imageCtrl.imageUrl`,
  //         htmlForId: 'imgUpload',
  //       };

  //     case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
  //       return {
  //         imageCtrl: values.view.childrenViews[index!]?.items?.[listItemIndex!],
  //         imageFilePath: `view.childrenViews.${index}.items.${listItemIndex}.imageFile`,
  //         imageUrl: `view.childrenViews.${index}.items.${listItemIndex}.imageUrl`,
  //         htmlForId: `smallImgUpload-${listItemIndex}`,
  //       };

  //     case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
  //       return {
  //         imageCtrl: values.view.profileIconUrl,
  //         imageFilePath: `view.profileIconUrlImageFile`,
  //         imageUrl: `view.profileIconUrl`,
  //         htmlForId: 'smallImgUpload',
  //       };

  //     case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
  //       return {
  //         imageCtrl: values.view.childrenViews[index!]?.profileIconUrl,
  //         imageFilePath: `view.childrenViews.${index}.profileIconUrlImageFile`,
  //         imageUrl: `view.childrenViews.${index}.profileIconUrl`,
  //         htmlForId: 'smallImgUpload',
  //       };
  //     default:
  //       return { imageCtrl: '', imageFilePath: '', imageUrl: '', htmlForId: '' };
  //   }
  // };
  const {
    imageCtrl: imgCtrl,
    imageFilePath,
    imageUrl,
    htmlForId,
  } = handleImageCtrlIdPath({
    imageCtrl,
    index,
    listItemIndex,
  });
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
      console.log('file', e.target.files);
      console.log(
        'file size:',
        e.target.files[0].size,
        'limit size:',
        FILE_SIZE,
        '업로드파일 리미트와 비교',
        e.target.files[0].size > FILE_SIZE,
      );
      if (e.target.files[0].size > FILE_SIZE) {
        e.target.files = null;
        e.target.value = '';
        await error({
          title: t(`VALIDATION_FILE_SIZE_TITLE`),
          description: t(`VALIDATION_FILE_SIZE`),
        });

        return;
      } else if (!SUPPORTED_FORMATS.includes(e.target.files[0]?.type)) {
        await error({
          title: t(`VALIDATION_FILE_TYPE_TITLE`),
          description: t(`VALIDATION_FILE_TYPE`),
        });
        return;
      }
      setValue(imageFilePath, e.target.files);
    }
  };
  console.log('imageRatio', imageRatio);

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
              <img src={getValues(imageUrl)} alt="templateImage" />
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

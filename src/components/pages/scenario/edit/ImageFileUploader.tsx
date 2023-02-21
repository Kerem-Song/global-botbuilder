import { icImg } from '@assets';
import { useRootState } from '@hooks';
import { imageUploadClient } from '@hooks/client/uploadImageClient';
import { IMAGE_CTRL_TYPES, ImageAspectRatio, TImageTypes } from '@models';
import { ID_GEN, ID_TYPES } from '@modules';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

interface IImageSetting {
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  imageRatio?: ImageAspectRatio | undefined;
}

export const ImageFileUploader = ({
  imageCtrl,
  index,
  listItemIndex,
  imageRatio,
}: IImageSetting) => {
  const { register, getValues, setValue, watch } = useFormContext();
  const values = getValues();

  const { imageUploadAsync } = imageUploadClient();
  const token = useRootState((state) => state.botInfoReducer.token);

  const handleImageCtrlIdPath = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.IMAGE_CTRL:
        return {
          imageCtrl: values.view.imageCtrl,
          imageFilePath: 'view.imageCtrl',
          imageUrl: 'view.imageCtrl.imageUrl',
        };

      case IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.items?.[listItemIndex!]?.imageCtrl,
          imageFilePath: `view.items.${listItemIndex}.imageFile`,
          imageUrl: `view.items.${listItemIndex}.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.imageCtrl,
          imageFilePath: `view.childrenViews.${index}.imageFile`,
          imageUrl: `view.childrenViews.${index}.imageCtrl.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
        return {
          imageCtrl:
            values.view.childrenViews[index!]?.items?.[listItemIndex!]?.imageCtrl,
          imageFilePath: `view.childrenViews.${index}.items.${listItemIndex}.imageFile`,
          imageUrl: `view.childrenViews.${index}.items.${listItemIndex}.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.profileIconUrl,
          imageFilePath: `view.profileIconUrlImageFile`,
          imageUrl: `view.profileIconUrl`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.profileIconUrl,
          imageFilePath: `view.childrenViews.${index}.profileIconUrlImageFile`,
          imageUrl: `view.childrenViews.${index}.profileIconUrl`,
        };
      default:
        return { imageCtrl: '', imageFilePath: '', imageUrl: '' };
    }
  };

  const handleImageCtrlId = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return ID_GEN.generate(ID_TYPES.PROFILE);

      default:
        return handleImageCtrlIdPath().imageCtrl?.id;
    }
  };

  const handleUploadImage = async () => {
    console.log('get@', handleImageCtrlIdPath().imageFilePath);
    console.log('getget!', getValues(handleImageCtrlIdPath().imageFilePath));
    if (token && getValues(handleImageCtrlIdPath().imageFilePath).length > 0) {
      const formData = new FormData();
      formData.append('File', getValues(handleImageCtrlIdPath().imageFilePath)[0]);
      formData.append('SessionToken', token);
      formData.append('CtrlId', handleImageCtrlId());

      imageUploadAsync({ formData })
        .then((res) => {
          console.log('res.data image', res?.data);
          setValue(handleImageCtrlIdPath().imageUrl, res?.data.result);
          setValue(handleImageCtrlIdPath().imageFilePath, null);
        })
        .catch((err) => {
          setValue(handleImageCtrlIdPath().imageUrl, null);
          setValue(handleImageCtrlIdPath().imageFilePath, null);
          //modal 띄우기?
          console.log('upload 실패', err);
        });
    } else {
      console.log('upload 파일이 없음');
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('file', e.target.files);
      setValue(handleImageCtrlIdPath().imageFilePath, e.target.files);

      // handleUploadImage();
    }
  };

  return (
    <>
      <label
        htmlFor="imgUpload"
        className={classnames('imgUploadLabel', {
          skeleton: !getValues(handleImageCtrlIdPath().imageUrl),
        })}
      >
        <div
          className={classnames(`imgUploadWrapper`, {
            small:
              imageCtrl === IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL ||
              imageCtrl === IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL ||
              imageCtrl === IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL ||
              imageCtrl === IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL,
            regtangle: imageRatio === ImageAspectRatio.Rectangle,
          })}
        >
          <div className={classnames('imgUploadSkeleton')}>
            {watch(handleImageCtrlIdPath().imageUrl) ? (
              <img
                src={getValues(handleImageCtrlIdPath().imageUrl)}
                alt="templateImage"
              />
            ) : (
              <img src={icImg} alt="icImg" />
            )}

            <input
              type="file"
              id="imgUpload"
              accept="image/png, image/jpeg, image/jpg"
              className="file-name-input"
              onChange={handleChangeFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </label>
      <button onClick={handleUploadImage} type="button">
        test
      </button>
    </>
  );
};

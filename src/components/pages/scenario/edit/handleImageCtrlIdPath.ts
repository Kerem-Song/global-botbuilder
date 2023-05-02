import { IMAGE_CTRL_TYPES, ImageAspectRatio, TImageTypes } from '@models';
import { useFormContext } from 'react-hook-form';

interface IImageSetting {
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  imageRatio?: ImageAspectRatio | undefined;
  isValid?: boolean;
}

export const handleImageCtrlIdPath = ({
  imageCtrl,
  index,
  listItemIndex,
}: IImageSetting) => {
  const { getValues } = useFormContext();
  const values = getValues();

  switch (imageCtrl) {
    case IMAGE_CTRL_TYPES.IMAGE_CTRL:
      return {
        imageCtrl: values.view.imageCtrl,
        imageCtrlPath: 'view.imageCtrl',
        imageFilePath: 'view.imageCtrl.imageFile',
        imageUrl: 'view.imageCtrl.imageUrl',
        htmlForId: 'imgUpload',
      };

    case IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL:
      return {
        imageCtrl: values.view.items?.[listItemIndex!],
        imageCtrlPath: `view.items.${listItemIndex}`,
        imageFilePath: `view.items.${listItemIndex}.imageFile`,
        imageUrl: `view.items.${listItemIndex}.imageUrl`,
        htmlForId: `smallImgUpload-${listItemIndex}`,
      };

    case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
      return {
        imageCtrl: values.view.childrenViews[index!]?.imageCtrl,
        imageCtrlPath: `view.childrenViews.${index}.imageCtrl`,
        imageFilePath: `view.childrenViews.${index}.imageFile`,
        imageUrl: `view.childrenViews.${index}.imageCtrl.imageUrl`,
        htmlForId: 'imgUpload',
      };

    case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
      return {
        imageCtrl: values.view.childrenViews[index!]?.items?.[listItemIndex!],
        imageCtrlPath: `view.childrenViews.${index}.items.${listItemIndex}`,
        imageFilePath: `view.childrenViews.${index}.items.${listItemIndex}.imageFile`,
        imageUrl: `view.childrenViews.${index}.items.${listItemIndex}.imageUrl`,
        htmlForId: `smallImgUpload-${listItemIndex}`,
      };

    case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
      return {
        imageCtrl: values.view.profileIconUrl,
        imageCtrlPath: `view.profileIconUrl`,
        imageFilePath: `view.profileIconUrlImageFile`,
        imageUrl: `view.profileIconUrl`,
        htmlForId: 'smallImgUpload',
      };

    case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
      return {
        imageCtrl: values.view.childrenViews[index!]?.profileIconUrl,
        imageCtrlPath: `view.childrenViews.${index}.profileIconUrl`,
        imageFilePath: `view.childrenViews.${index}.profileIconUrlImageFile`,
        imageUrl: `view.childrenViews.${index}.profileIconUrl`,
        htmlForId: 'smallImgUpload',
      };
    default:
      return {
        imageCtrl: '',
        imageCtrlPath: '',
        imageFilePath: '',
        imageUrl: '',
        htmlForId: '',
      };
  }
};

import { Col, Row, Space } from '@components/layout';
import { usePage } from '@hooks';
import { ImageAspectRatio } from '@models/enum';
import { IMAGE_CTRL_TYPES, TImageTypes } from '@models/types/ImageType';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

import { ImageFileUploader } from './ImageFileUploader';
interface IImageSetting {
  imageRatio: ImageAspectRatio | undefined;
  setImageRatio: Dispatch<SetStateAction<ImageAspectRatio | undefined>>;
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
}

export const ImageSettings = ({
  imageRatio,
  setImageRatio,
  imageCtrl,
  index,
  listItemIndex,
}: IImageSetting) => {
  const { t } = usePage();
  const { register, getValues } = useFormContext();
  const values = getValues();

  const handleImageCtrlIdPath = () => {
    switch (imageCtrl) {
      case IMAGE_CTRL_TYPES.IMAGE_CTRL:
        return {
          imageCtrl: values.view.imageCtrl,
          imageFilePath: 'view.imageCtrl',
        };

      case IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.items[listItemIndex!].imageCtrl,
          imageFilePath: `view.items.${listItemIndex}`,
        };

      case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.imageCtrl,
          imageFilePath: `view.childrenViews.${index}.imageCtrl`,
        };

      case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.items[listItemIndex!],
          imageFilePath: `view.childrenViews.${index}.items.${listItemIndex}`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.profileIconUrl,
          imageFilePath: `view.profileIconUrl`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.profileIconUrl,
          imageFilePath: `view.childrenViews.${index}.profileIconUrl`,
        };
      default:
        return { imageCtrlIdPath: '', imageFilePath: '' };
    }
  };

  return (
    <Space direction="vertical">
      <div className="m-b-8">
        <span className="subLabel">{t(`IMAGE_UPLOAD_LABEL`)} </span>
        <span className="required">*</span>
      </div>

      <span className="subLabel bold">{t(`IMAGE_TYPE`)}</span>
      <Row justify="space-between">
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Rectangle}
            checked={
              Number(handleImageCtrlIdPath().imageCtrl?.aspectRatio) ===
              ImageAspectRatio.Rectangle
            }
            onClick={() => setImageRatio(ImageAspectRatio.Rectangle)}
          />
          <span>{t(`IMAGE_TYPE_RECTANGLE`)}</span>
        </Col>
        <Col span={12} className="radioContainer">
          <input
            className="radio"
            {...register(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`, {
              valueAsNumber: true,
            })}
            type="radio"
            value={ImageAspectRatio.Square}
            checked={
              Number(handleImageCtrlIdPath().imageCtrl?.aspectRatio) ===
              ImageAspectRatio.Square
            }
            onClick={() => setImageRatio(ImageAspectRatio.Square)}
          />
          <span>{t(`IMAGE_TYPE_SQUARE`)}</span>
        </Col>
      </Row>

      <ImageFileUploader
        imageCtrl={imageCtrl}
        index={index}
        listItemIndex={listItemIndex}
        imageRatio={imageRatio}
      />
    </Space>
  );
};

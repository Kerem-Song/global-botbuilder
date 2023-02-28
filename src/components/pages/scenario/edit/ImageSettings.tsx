import { Col, Row, Space } from '@components/layout';
import { usePage, useSystemModal } from '@hooks';
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
  const { t, tc } = usePage();
  const { confirm } = useSystemModal();
  const { register, getValues, setValue } = useFormContext();
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

  const setImageAspectRatioModal = async (ratio: ImageAspectRatio) => {
    const result = await confirm({
      title: t(`IMAGE_TYPE_CHANGE`),
      description: (
        <>
          <span>
            {ratio === ImageAspectRatio.Rectangle
              ? t(`IMAGE_SETTING_TYPE_RECTANGLE_WARNING`)
              : t(`IMAGE_SETTING_TYPE_SQUARE_WARNING`)}
          </span>
        </>
      ),
    });

    if (result) {
      ratio === ImageAspectRatio.Rectangle && setImageRatio(ImageAspectRatio.Rectangle);
      ratio === ImageAspectRatio.Square && setImageRatio(ImageAspectRatio.Square);
    } else {
      if (ratio === ImageAspectRatio.Rectangle) {
        setValue(
          handleImageCtrlIdPath().imageFilePath + `.aspectRatio`,
          ImageAspectRatio.Square,
        );
        setImageRatio(ImageAspectRatio.Rectangle);
      } else {
        setValue(
          handleImageCtrlIdPath().imageFilePath + `.aspectRatio`,
          ImageAspectRatio.Rectangle,
        );
        setImageRatio(ImageAspectRatio.Square);
      }
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
            onClick={() => setImageAspectRatioModal(ImageAspectRatio.Rectangle)}
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
            onClick={() => setImageAspectRatioModal(ImageAspectRatio.Square)}
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

import { Radio } from '@components';
import { Col, Row, Space } from '@components/layout';
import { usePage, useSystemModal } from '@hooks';
import { ImageAspectRatio } from '@models/enum';
import { IMAGE_CTRL_TYPES, TImageTypes } from '@models/types/ImageType';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ImageFileUploader } from './ImageFileUploader';
interface IImageSetting {
  imageRatio: ImageAspectRatio | undefined;
  setImageRatio: Dispatch<SetStateAction<ImageAspectRatio | undefined>>;
  imageCtrl: TImageTypes;
  index?: number;
  listItemIndex?: number;
  isValid?: boolean;
}

export const ImageSettings = ({
  imageRatio,
  setImageRatio,
  imageCtrl,
  index,
  listItemIndex,
  isValid,
}: IImageSetting) => {
  const { t, tc } = usePage();
  const { confirm } = useSystemModal();
  const { getValues, setValue, watch, control } = useFormContext();
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
        return { imageCtrl: '', imageFilePath: '' };
    }
  };

  const setImageAspectRatioModal = async (ratio: ImageAspectRatio) => {
    const handleDesc = () => {
      let desc;
      if (
        imageCtrl === IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL &&
        ratio === ImageAspectRatio.Rectangle
      ) {
        desc = t(`IMAGE_SETTING_TYPE_CAROUSEL_RECTANGLE_WARNING`);
      } else if (
        imageCtrl === IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL &&
        ratio === ImageAspectRatio.Square
      ) {
        desc = t(`IMAGE_SETTING_TYPE_CAROUSEL_SQUARE_WARNING`);
      } else if (
        imageCtrl === IMAGE_CTRL_TYPES.IMAGE_CTRL &&
        ratio === ImageAspectRatio.Rectangle
      ) {
        desc = t(`IMAGE_SETTING_TYPE_RECTANGLE_WARNING`);
      } else {
        desc = t(`IMAGE_SETTING_TYPE_SQUARE_WARNING`);
      }
      return desc;
    };
    const result = await confirm({
      title: t(`IMAGE_TYPE_CHANGE`),
      description: (
        <>
          <span style={{ whiteSpace: 'pre-line' }}>
            {/* {ratio === ImageAspectRatio.Rectangle
              ? t(`IMAGE_SETTING_TYPE_RECTANGLE_WARNING`)
              : t(`IMAGE_SETTING_TYPE_SQUARE_WARNING`)} */}
            {handleDesc()}
          </span>
        </>
      ),
    });

    if (result) {
      if (ratio === ImageAspectRatio.Rectangle) {
        setImageRatio(ImageAspectRatio.Rectangle);

        setValue(
          handleImageCtrlIdPath().imageFilePath + `.aspectRatio`,
          ImageAspectRatio.Rectangle,
        );
      }
      if (ratio === ImageAspectRatio.Square) {
        setImageRatio(ImageAspectRatio.Square);

        setValue(
          handleImageCtrlIdPath().imageFilePath + `.aspectRatio`,
          ImageAspectRatio.Square,
        );
      }
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

  const { field: aspectRatio } = useController({ name: 'aspectRatio', control });

  useEffect(() => {
    console.log('image settings');
  }, [aspectRatio]);

  return (
    <Space direction="vertical">
      <div className="m-b-8">
        <span className="subLabel">{t(`IMAGE_UPLOAD_LABEL`)} </span>
        <span className="required">*</span>
      </div>

      <span className="subLabel bold">{t(`IMAGE_TYPE`)}</span>
      <Row justify="space-between">
        <Col span={12} className="radioContainer">
          <Radio
            checked={
              watch(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`) ===
              ImageAspectRatio.Rectangle
            }
            onChange={() => setImageAspectRatioModal(ImageAspectRatio.Rectangle)}
            ref={aspectRatio.ref}
          >
            <span>{t(`IMAGE_TYPE_RECTANGLE`)}</span>
          </Radio>
        </Col>
        <Col span={12} className="radioContainer">
          <Radio
            checked={
              watch(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`) ===
              ImageAspectRatio.Square
            }
            onChange={() => setImageAspectRatioModal(ImageAspectRatio.Square)}
            ref={aspectRatio.ref}
          >
            <span>{t(`IMAGE_TYPE_SQUARE`)}</span>
          </Radio>
        </Col>
      </Row>

      <ImageFileUploader
        imageCtrl={imageCtrl}
        index={index}
        listItemIndex={listItemIndex}
        imageRatio={watch(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`)}
        isValid={isValid}
      />
    </Space>
  );
};

import { Col, Radio, Row, Space } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { IImageSetting, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { useController, useFormContext } from 'react-hook-form';

import { handleImageCtrlIdPath } from './handleImageCtrlIdPath';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';

export const ImageSettings = ({
  imageRatio,
  setImageRatio,
  imageCtrl,
  index,
  listItemIndex,
  isValid,
  isDataCard,
}: IImageSetting) => {
  const { t } = usePage();
  const { confirm } = useSystemModal();
  const { setValue, watch, control } = useFormContext();

  const { imageCtrlPath, imageUrl } = handleImageCtrlIdPath({
    imageCtrl,
    index,
    listItemIndex,
  });

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
          <span style={{ whiteSpace: 'pre-line' }}>{handleDesc()}</span>
        </>
      ),
    });

    if (result) {
      if (ratio === ImageAspectRatio.Rectangle) {
        setImageRatio(ImageAspectRatio.Rectangle);

        if (imageCtrl === IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL) {
          const childrenViewsLength = watch(`view.childrenViews`);

          for (const i in childrenViewsLength) {
            setValue(
              `view.childrenViews.${i}.imageCtrl.aspectRatio`,
              ImageAspectRatio.Rectangle,
              { shouldDirty: true },
            );
          }
        } else {
          setValue(imageCtrlPath + `.aspectRatio`, ImageAspectRatio.Rectangle, {
            shouldDirty: true,
          });
        }
      }
      if (ratio === ImageAspectRatio.Square) {
        setImageRatio(ImageAspectRatio.Square);
        if (imageCtrl === IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL) {
          const childrenViewsLength = watch(`view.childrenViews`);

          for (const i in childrenViewsLength) {
            setValue(
              `view.childrenViews.${i}.imageCtrl.aspectRatio`,
              ImageAspectRatio.Square,
              { shouldDirty: true },
            );
          }
        } else {
          setValue(imageCtrlPath + `.aspectRatio`, ImageAspectRatio.Square, {
            shouldDirty: true,
          });
        }
      }
    } else {
      if (ratio === ImageAspectRatio.Rectangle) {
        setValue(imageCtrlPath + `.aspectRatio`, ImageAspectRatio.Square, {
          shouldDirty: true,
        });
        setImageRatio(ImageAspectRatio.Rectangle);
      } else {
        setValue(imageCtrlPath + `.aspectRatio`, ImageAspectRatio.Rectangle, {
          shouldDirty: true,
        });
        setImageRatio(ImageAspectRatio.Square);
      }
    }
  };

  const { field: aspectRatio } = useController({ name: 'aspectRatio', control });

  return (
    <Space direction="vertical" gap={12}>
      <Space direction="vertical" gap={8}>
        <span className="subLabel bold">{t(`IMAGE_TYPE`)}</span>
        <Row justify="space-between">
          <Col span={12} className="radioContainer">
            <Radio
              name="aspectRatio"
              checked={
                watch(imageCtrlPath + `.aspectRatio`) === ImageAspectRatio.Rectangle
              }
              onChange={(e) => {
                if (imageCtrl !== IMAGE_CTRL_TYPES.IMAGE_CTRL) {
                  setImageAspectRatioModal(ImageAspectRatio.Rectangle);
                } else {
                  setImageRatio(ImageAspectRatio.Rectangle);
                  setValue(imageCtrlPath + `.aspectRatio`, ImageAspectRatio.Rectangle, {
                    shouldDirty: true,
                  });
                }
                aspectRatio.onChange(e);
              }}
              ref={aspectRatio.ref}
            >
              <span>{t(`IMAGE_TYPE_RECTANGLE`)}</span>
            </Radio>
          </Col>
          <Col span={12} className="radioContainer">
            <Radio
              name="aspectRatio"
              checked={watch(imageCtrlPath + `.aspectRatio`) === ImageAspectRatio.Square}
              onChange={(e) => {
                setImageAspectRatioModal(ImageAspectRatio.Square);
                aspectRatio.onChange(e);
              }}
              ref={aspectRatio.ref}
            >
              <span>{t(`IMAGE_TYPE_SQUARE`)}</span>
            </Radio>
          </Col>
        </Row>
        <div>
          <span className="subLabel">
            {t(`IMAGE_UPLOAD_LABEL`)}/{t(`IMAGE_DIRECT_INPUT`)}
          </span>
          <span className="required"> *</span>
        </div>
        <ImageFileUploader
          imageCtrl={imageCtrl}
          index={index}
          listItemIndex={listItemIndex}
          imageRatio={watch(imageCtrlPath + `.aspectRatio`)}
          isValid={isValid}
        />
      </Space>
      <ImageInput
        imageCtrl={imageCtrl}
        index={index}
        listItemIndex={listItemIndex}
        registerName={imageUrl}
        placeholder={
          isDataCard
            ? t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)
            : t(`IMAGE_INPUT_PLACEHOLDER`)
        }
        isValid={isValid}
      />
    </Space>
  );
};

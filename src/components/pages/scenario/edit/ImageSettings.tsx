import { Input, Radio } from '@components';
import { Col, Row, Space } from '@components/layout';
import { useHistoryViewerMatch, usePage, useRootState, useSystemModal } from '@hooks';
import { ImageAspectRatio } from '@models/enum';
import { IMAGE_CTRL_TYPES, TImageTypes } from '@models/types/ImageType';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
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
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { t, tc } = usePage();
  const { confirm } = useSystemModal();
  const { getValues, setValue, register, watch, control } = useFormContext();
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();

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
          imageCtrl: values.view.items[listItemIndex!].imageCtrl,
          imageFilePath: `view.items.${listItemIndex}`,
          imageUrl: `view.items.${listItemIndex}.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.imageCtrl,
          imageFilePath: `view.childrenViews.${index}.imageCtrl`,
          imageUrl: `view.childrenViews.${index}.imageCtrl.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.items[listItemIndex!],
          imageFilePath: `view.childrenViews.${index}.items.${listItemIndex}`,
          imageUrl: `view.childrenViews.${index}.items.${listItemIndex}.imageUrl`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.profileIconUrl,
          imageFilePath: `view.profileIconUrl`,
          imageUrl: `view.profileIconUrl`,
        };

      case IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL:
        return {
          imageCtrl: values.view.childrenViews[index!]?.profileIconUrl,
          imageFilePath: `view.childrenViews.${index}.profileIconUrl`,
          imageUrl: `view.childrenViews.${index}.profileIconUrl`,
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
          <span style={{ whiteSpace: 'pre-line' }}>{handleDesc()}</span>
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

  const token = useRootState((state) => state.botInfoReducer.token);
  const handleImgUrlInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('@handle input img url check', e.target.value);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (e.target.value) {
        setValue(
          handleImageCtrlIdPath().imageUrl!,
          `${import.meta.env.VITE_API_BASE_URL}/builderimage/forbuilder?origin=${
            e.target.value
          }&sessionToken=${token}`,
        );
      }
    }, 1000);

    setTimer(newTimer);
  };

  return (
    <Space direction="vertical">
      <span className="subLabel bold">{t(`IMAGE_TYPE`)}</span>
      <Row justify="space-between">
        <Col span={12} className="radioContainer">
          <Radio
            name="aspectRatio"
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
            name="aspectRatio"
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

      <div className="m-b-8">
        <span className="subLabel">{t(`IMAGE_UPLOAD_LABEL`)} </span>
        <span className="required">*</span>
      </div>

      <ImageFileUploader
        imageCtrl={imageCtrl}
        index={index}
        listItemIndex={listItemIndex}
        imageRatio={watch(handleImageCtrlIdPath().imageFilePath + `.aspectRatio`)}
        isValid={isValid}
      />

      <span className="subLabel">{t(`IMAGE_DIRECT_INPUT`)}</span>
      <Input
        // {...register(handleImageCtrlIdPath().imageUrl!)}
        placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
        readOnly={isHistoryViewer}
        // className={classNames('luna-input', { 'luna-input-error': !isValid })}
        onChange={handleImgUrlInput}
      />
    </Space>
  );
};

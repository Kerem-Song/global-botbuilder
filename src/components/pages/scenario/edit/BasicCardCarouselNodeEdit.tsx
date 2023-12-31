import { Collapse, FormItem, Space } from '@components';
import { useNodeEditSave, usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IBasicCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const BasicCardCarousleNodeEdit = () => {
  useNodeEditSave();
  const { t, isReadOnly } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardCarouselView>>();
  const values = getValues();

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];

  const { fields: childrenViewsField } = useFieldArray({
    name: `view.childrenViews`,
    control,
  });

  // useEffect(() => {
  //   if (watch(`view.childrenViews.${index ? index : 0}.imageCtrl.imageUrl`) !== '') {
  //     setValue(`view.useImageCtrl`, true);
  //   }
  // }, [index]);

  return (
    <div key={values.id}>
      {watch(`view.childrenViews.${index}.id`) &&
        childrenViewsField.map(
          (childrenView, i) =>
            index === i && (
              <div key={childrenView.id}>
                <Collapse
                  label={t(`IMAGE_SETTING`)}
                  useSwitch={true}
                  field={`useImageCtrl`}
                  index={index}
                >
                  {(watch(`view.useImageCtrl`) ||
                    watch(`view.childrenViews.${index}.imageCtrl.imageUrl`)) && (
                    <FormItem
                      error={errors.view?.childrenViews?.[index]?.imageCtrl?.imageUrl}
                    >
                      <ImageSettings
                        imageRatio={Number(
                          watch(`view.childrenViews.${index}.imageCtrl.aspectRatio`),
                        )}
                        // imageRatio={childrenView.imageCtrl?.aspectRatio}
                        setImageRatio={setImageRatio}
                        index={index}
                        imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
                        isValid={
                          errors.view?.childrenViews?.[index]?.imageCtrl?.imageUrl
                            ? false
                            : true
                        }
                      />
                    </FormItem>
                  )}
                </Collapse>

                <Collapse label={t(`BASIC_NODE_TEXT_SETTING`)} useSwitch={false}>
                  <Space direction="vertical" gap={12}>
                    <FormItem error={errors.view?.childrenViews?.[index]?.title}>
                      <InputWithTitleCounter
                        label={t(`TITLE_INPUT`)}
                        showCount={true}
                        maxLength={40}
                        isLight={true}
                        {...register(`view.childrenViews.${index}.title`)}
                        placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
                        textLength={
                          watch(`view.childrenViews.${index}.title`)?.length || 0
                        }
                        readOnly={isReadOnly}
                      />
                    </FormItem>

                    <FormItem error={errors.view?.childrenViews?.[index]?.description}>
                      <InputTextAreaWithTitleCounter
                        label={t(`CONTENT_INPUT`)}
                        maxRows={17}
                        showCount
                        maxLength={230}
                        isLight={true}
                        placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
                        {...register(`view.childrenViews.${index}.description`)}
                        textLength={
                          watch(`view.childrenViews.${index}.description`)?.length || 0
                        }
                        readOnly={isReadOnly}
                      />
                    </FormItem>
                  </Space>
                </Collapse>

                <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
                  {values.view?.childrenViews?.[i]?.buttons && (
                    <ButtonsEdit
                      index={i}
                      isCarousel={true}
                      imageRatio={watch(
                        `view.childrenViews.${index}.imageCtrl.aspectRatio`,
                      )}
                      nodeId={values.id}
                      useCounter={true}
                    />
                  )}
                </Collapse>

                <ConnectNodeBottomEdit nodeId={values.id} />
              </div>
            ),
        )}
    </div>
  );
};

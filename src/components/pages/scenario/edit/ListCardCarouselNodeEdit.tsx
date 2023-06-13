import { Collapse, FormItem } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IListCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ListCardCarouselItems } from './ListCardCarouselItems';

export const ListCardCarouselNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardCarouselView>>();
  const values = getValues();
  console.log('list card node edit value.view', values.view);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];
  const isHistoryViewer = useHistoryViewerMatch();

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
    <>
      {watch(`view.childrenViews.${index}.id`) &&
        childrenViewsField.map(
          (childrenView, i) =>
            index === i && (
              <div key={childrenView.id}>
                <Collapse label={t(`LIST_NODE_HEAD_TITLE_SETTING`)} useSwitch={false}>
                  <FormItem error={errors.view?.childrenViews?.[index]?.header}>
                    <InputWithTitleCounter
                      label={t(`LIST_NODE_HEAD_TITLE_INPUT`)}
                      required={true}
                      showCount={true}
                      maxLength={40}
                      isLight={true}
                      {...register(`view.childrenViews.${index}.header`)}
                      textLength={
                        watch(`view.childrenViews.${index}.header`)?.length || 0
                      }
                      placeholder={t(`LIST_NODE_HEAD_TITLE_INPUT_PLACEHOLDER`)}
                      readOnly={isHistoryViewer}
                    />
                  </FormItem>
                </Collapse>

                <Collapse
                  label={t(`LIST_NODE_HEAD_IMAGE_SETTING`)}
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

                <ListCardCarouselItems nestedIndex={i} />

                <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
                  {values.view && values.view?.childrenViews[index]?.buttons && (
                    <ButtonsEdit
                      index={index}
                      isCarousel={true}
                      imageRatio={watch(
                        `view.childrenViews.${index}.imageCtrl.aspectRatio`,
                      )}
                      nodeId={values.id}
                      useCounter={true}
                    />
                  )}
                </Collapse>
              </div>
            ),
        )}
    </>
  );
};

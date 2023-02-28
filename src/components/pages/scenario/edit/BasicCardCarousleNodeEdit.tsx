import { FormItem, Input, InputTextarea } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { Space } from '@components/layout';
import { usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IBasicCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';

export const BasicCardCarousleNodeEdit = () => {
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardCarouselView>>();
  const values = getValues();
  console.log('basic card carousel node edit values', values);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = Object.values(carouselIndexObj)[0];

  const { fields } = useFieldArray({
    name: `view.childrenViews.${index}.buttons`,
    control,
  });

  useEffect(() => {
    console.log('basic card caro index', index);
  }, [index]);

  return (
    <>
      {watch(`view.childrenViews.${index}.id`) && (
        <>
          <Collapse
            label={t(`IMAGE_SETTING`)}
            useSwitch={true}
            field={`childrenViews.${index}.imageCtrl`}
          >
            {watch(`view.childrenViews.${index}.imageCtrl`) && (
              <ImageSettings
                imageRatio={imageRatio}
                setImageRatio={setImageRatio}
                index={index}
                imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
              />
            )}
          </Collapse>

          <Collapse label={t(`BASIC_NODE_TEXT_SETTING`)} useSwitch={false}>
            <Space direction="vertical">
              {/* <span className="subLabel">{t(`TITLE_INPUT`)}</span> */}
              <FormItem
                error={
                  errors.view &&
                  errors.view.childrenViews &&
                  errors.view.childrenViews[index]?.title
                }
              >
                <Input
                  hasTitle={true}
                  label={t(`TITLE_INPUT`)}
                  showCount={true}
                  maxLength={20}
                  isLight={true}
                  {...register(`view.childrenViews.${index}.title`)}
                  placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
                />
              </FormItem>

              <FormItem
                error={
                  errors.view &&
                  errors.view.childrenViews &&
                  errors.view.childrenViews[index]?.description
                }
              >
                <InputTextarea
                  label={t(`CONTENT_INPUT`)}
                  hasTitle={true}
                  height={100}
                  showCount
                  maxLength={1000}
                  isLight={true}
                  placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
                  {...register(`view.childrenViews.${index}.description`)}
                />
              </FormItem>
            </Space>
          </Collapse>

          <Collapse label={t(`BUTTON`)} useSwitch={false}>
            {values.view &&
              values.view.childrenViews &&
              values.view.childrenViews[index]?.buttons && <ButtonsEdit index={index} />}
          </Collapse>
        </>
      )}
    </>
  );
};

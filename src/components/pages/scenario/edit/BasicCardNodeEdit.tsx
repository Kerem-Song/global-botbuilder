import { FormItem, InputTextarea, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const BasicCardNodeEdit = () => {
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardView>>();
  const values = getValues();
  console.log('basic card node edit', values);

  const { fields, append, remove } = useFieldArray({
    name: `view.buttons`,
    control,
  });

  useEffect(() => {
    console.log('basic card node edit');
  }, [fields]);

  return (
    <>
      <Collapse label={t(`IMAGE_SETTING`)} useSwitch={true} field={'imageCtrl'}>
        {watch(`view.imageCtrl`) && (
          <ImageSettings
            imageRatio={imageRatio}
            setImageRatio={setImageRatio}
            imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
          />
        )}
      </Collapse>

      <Collapse label={t(`BASIC_NODE_TEXT_SETTING`)} useSwitch={false}>
        <Space direction="vertical">
          {/* <span className="subLabel">{t(`TITLE_INPUT`)}</span> */}
          <FormItem error={errors.view && errors.view.title}>
            <InputWithTitleCounter
              label={t(`TITLE_INPUT`)}
              showCount={true}
              maxLength={20}
              isLight={true}
              {...register('view.title')}
              placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
              textLength={watch('view.title')?.length || 0}
            />
          </FormItem>

          <FormItem error={errors.view && errors.view.description}>
            <InputTextarea
              label={t(`CONTENT_INPUT`)}
              height={100}
              style={{ minHeight: '100px', maxHeight: '320px' }}
              showCount
              maxLength={1000}
              isLight={true}
              placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
              {...register('view.description')}
              textLength={watch('view.description')?.length || 0}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={t(`BUTTON`)} useSwitch={false}>
        {values.view && values.view.buttons && <ButtonsEdit />}
      </Collapse>
    </>
  );
};

import { Collapse, FormItem, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const BasicCardNodeEdit = () => {
  useNodeEditSave();
  const { t, isReadOnly } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardView>>();
  const values = getValues();

  return (
    <div key={values.id}>
      <Collapse label={t(`IMAGE_SETTING`)} useSwitch={true} field={'useImageCtrl'}>
        {(watch(`view.useImageCtrl`) || watch(`view.imageCtrl.imageUrl`)) && (
          <FormItem error={errors.view?.imageCtrl?.imageUrl}>
            <ImageSettings
              imageRatio={Number(watch(`view.imageCtrl.aspectRatio`))}
              setImageRatio={setImageRatio}
              imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
              isValid={errors.view?.imageCtrl?.imageUrl ? false : true}
            />
          </FormItem>
        )}
      </Collapse>

      <Collapse label={t(`BASIC_NODE_TEXT_SETTING`)} useSwitch={false}>
        <Space direction="vertical" gap={12}>
          <FormItem error={errors.view && errors.view.title}>
            <InputWithTitleCounter
              label={t(`TITLE_INPUT`)}
              showCount={true}
              maxLength={40}
              isLight={true}
              {...register('view.title')}
              placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
              textLength={watch('view.title')?.length || 0}
              readOnly={isReadOnly}
            />
          </FormItem>

          <FormItem error={errors.view && errors.view.description}>
            <InputTextAreaWithTitleCounter
              label={t(`CONTENT_INPUT`)}
              maxRows={17}
              showCount
              maxLength={230}
              isLight={true}
              placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
              {...register('view.description')}
              textLength={watch('view.description')?.length || 0}
              readOnly={isReadOnly}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
        {values.view && values.view.buttons && (
          <ButtonsEdit
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            nodeId={values.id}
            useCounter={true}
          />
        )}
      </Collapse>

      <ConnectNodeBottomEdit nodeId={values.id} />
    </div>
  );
};

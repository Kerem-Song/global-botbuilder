import { Collapse, FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ListCardItems } from './ListCardtems';

export const ListCardNodeEdit = () => {
  useNodeEditSave();
  const { t, isReadOnly } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardView>>();
  const values = getValues();

  return (
    <div key={values.id}>
      <Collapse label={t(`LIST_NODE_HEAD_TITLE_SETTING`)} useSwitch={false}>
        <FormItem error={errors.view?.header}>
          <InputWithTitleCounter
            label={t(`LIST_NODE_HEAD_TITLE_INPUT`)}
            required={true}
            showCount={true}
            maxLength={40}
            isLight={true}
            {...register('view.header')}
            textLength={watch('view.header')?.length || 0}
            placeholder={t(`LIST_NODE_HEAD_TITLE_INPUT_PLACEHOLDER`)}
            readOnly={isReadOnly}
          />
        </FormItem>
      </Collapse>
      <Collapse
        label={t(`LIST_NODE_HEAD_IMAGE_SETTING`)}
        useSwitch={true}
        field={'useImageCtrl'}
      >
        {(watch(`view.useImageCtrl`) || watch(`view.imageCtrl.imageUrl`)) && (
          <FormItem error={errors.view?.imageCtrl?.imageUrl}>
            <ImageSettings
              imageRatio={watch(`view.imageCtrl.aspectRatio`)}
              setImageRatio={setImageRatio}
              imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
              isValid={errors.view?.imageCtrl?.imageUrl ? false : true}
            />
          </FormItem>
        )}
      </Collapse>

      <ListCardItems />

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

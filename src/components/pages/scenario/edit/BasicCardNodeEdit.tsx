import { FormItem, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const BasicCardNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardView>>();
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();
  useEffect(() => {
    if (watch(`view.imageCtrl.imageUrl`) !== '') {
      setValue(`view.useImageCtrl`, true);
    }
  }, [watch(`view.imageCtrl.imageUrl`)]);

  console.log('values in basiccard node edit', values.view);
  return (
    <>
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
        <Space direction="vertical">
          {/* <span className="subLabel">{t(`TITLE_INPUT`)}</span> */}
          {/* <div className="textareaWrapper">
            <p className={classNames('textareaLabel', 'light')}>{t(`TITLE_INPUT`)}</p>
            <span className="textCounter">
              {watch('view.title')?.length || 0}
              {`/20`}
            </span>
          </div> */}
          <FormItem error={errors.view && errors.view.title}>
            <InputWithTitleCounter
              label={t(`TITLE_INPUT`)}
              showCount={true}
              maxLength={20}
              isLight={true}
              {...register('view.title')}
              placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
              textLength={watch('view.title')?.length || 0}
              readOnly={isHistoryViewer}
            />
          </FormItem>

          <FormItem error={errors.view && errors.view.description}>
            <InputTextAreaWithTitleCounter
              label={t(`CONTENT_INPUT`)}
              maxRows={17}
              showCount
              maxLength={watch(`view.useImageCtrl`) || watch(`view.title`) ? 230 : 400}
              isLight={true}
              placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
              {...register('view.description')}
              textLength={watch('view.description')?.length || 0}
              readOnly={isHistoryViewer}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
        {values.view && values.view.buttons && (
          <ButtonsEdit
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            nodeId={values.id}
          />
        )}
      </Collapse>
    </>
  );
};

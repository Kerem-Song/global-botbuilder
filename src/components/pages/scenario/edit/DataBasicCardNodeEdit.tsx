import { Button, Col, FormItem, Radio, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IDataBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';

export const DataBasicCardNodeEdit = () => {
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
  } = useFormContext<IGNodeEditModel<IDataBasicCardView>>();
  const [carouselNum, setCarouselNum] = useState<number>(0);
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();
  const { field: carouselPrintOutField } = useController({ name: 'view.print', control });

  useEffect(() => {
    if (watch(`view.imageCtrl.imageUrl`) !== '') {
      setValue(`view.useImageCtrl`, true);
    }
  }, [watch(`view.imageCtrl.imageUrl`)]);

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
    } else {
      setCarouselNum((prev) => prev - 1);
    }
  };

  console.log('values in basiccard node edit', values.view);

  useEffect(() => {
    if (watch(`view.carousel`)) {
      setCarouselNum(Number(watch(`view.carousel`)));
    }
  }, [carouselNum]);

  return (
    <>
      <Collapse label={t(`VARIABLE_SETTING`)} useSwitch={false}>
        <p>{t(`DATA_BASIC_CARD_NODE_VARIABLE_INPUT_LABEL`)}</p>
        <FormItem error={errors.view?.attribute}>
          <ParameterSelector
            control={control}
            path={`view.attribute`}
            placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
      </Collapse>

      <Collapse label={t(`DATA_BASIC_CARD_NODE_CAROUSEL_SETTING`)} useSwitch={false}>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_NUMBER`)}</p>
        <div className="dataCardCrouselSlideBtns">
          <Button shape="ghost" onClick={() => handleCarouselNum(false)}>
            -
          </Button>
          <span {...register(`view.carousel`)}>{carouselNum}</span>
          <Button shape="ghost" onClick={() => handleCarouselNum(true)}>
            +
          </Button>
        </div>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.print') === 'order'}
                onChange={() => setValue(`view.print`, 'order')}
                ref={carouselPrintOutField.ref}
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_ORDER`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.print') === 'random'}
                onChange={() => setValue(`view.print`, 'random')}
                ref={carouselPrintOutField.ref}
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_RANDOM`)}</span>
              </Radio>
            </Col>
          </Row>
        </div>
      </Collapse>

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

      <Collapse label={t(`BUTTON`)} useSwitch={false}>
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

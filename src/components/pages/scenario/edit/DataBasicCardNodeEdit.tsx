import { Button, Col, Collapse, FormItem, Radio, Row, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IDataBasicCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';

export const DataBasicCardNodeEdit = () => {
  useNodeEditSave();
  const { t, isReadOnly } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IDataBasicCardView>>();
  const [carouselNum, setCarouselNum] = useState<number>(
    Number(watch('view.count')) || 1,
  );
  const values = getValues();

  const { field: carouselPrintOutField } = useController({
    name: 'view.isShuffle',
    control,
  });

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
      setValue('view.count', carouselNum + 1, { shouldDirty: true });
    } else {
      setCarouselNum((prev) => prev - 1);
      setValue('view.count', carouselNum - 1, { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (watch(`view.count`)) {
      setCarouselNum(watch(`view.count`));
    }
  }, [watch(`view.count`)]);

  return (
    <div key={values.id}>
      <Collapse label={t(`VARIABLE_SETTING`)} useSwitch={false}>
        <p className="m-b-12">{t(`DATA_BASIC_CARD_NODE_VARIABLE_INPUT_LABEL`)}</p>
        <FormItem error={errors.view?.itemsRefName}>
          <ParameterSelector
            control={control}
            path={`view.itemsRefName`}
            placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
            readOnly={isReadOnly}
            error={errors.view?.itemsRefName}
          />
        </FormItem>
      </Collapse>

      <Collapse label={t(`DATA_BASIC_CARD_NODE_CAROUSEL_SETTING`)} useSwitch={false}>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_NUMBER`)}</p>
        <Row className="dataCardCrouselSlideBtns">
          <Col span={3}>
            <Button
              className="counterBtn negative"
              shape="ghost"
              onClick={() => handleCarouselNum(false)}
              disabled={carouselNum <= 1 || isReadOnly}
            />
          </Col>
          <Col span={3}>
            <span>{watch(`view.count`)}</span>
          </Col>
          <Col span={3}>
            <Button
              className="counterBtn positive"
              shape="ghost"
              onClick={() => handleCarouselNum(true)}
              disabled={carouselNum >= 10 || isReadOnly}
            />
          </Col>
        </Row>
        <p className="m-b-12">{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-12">
            <Col span={12} className="radioContainer">
              <Radio
                name="view.isShuffle"
                checked={watch('view.isShuffle') === false}
                onChange={() => setValue(`view.isShuffle`, false, { shouldDirty: true })}
                ref={carouselPrintOutField.ref}
                value="order"
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_ORDER`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                name="view.isShuffle"
                checked={watch('view.isShuffle') === true}
                onChange={() => setValue(`view.isShuffle`, true, { shouldDirty: true })}
                ref={carouselPrintOutField.ref}
                value="random"
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
              isDataCard={true}
            />
          </FormItem>
        )}
      </Collapse>

      <Collapse label={t(`BASIC_NODE_TEXT_SETTING`)} useSwitch={false}>
        <Space direction="vertical" gap={12}>
          <FormItem error={errors.view && errors.view.title}>
            {/* <InputWithTitleCounter
              label={t(`TITLE_INPUT`)}
              isLight={true}
              {...register('view.title')}
              placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
              readOnly={isReadOnly}
            /> */}
            <InputTextAreaWithTitleCounter
              {...register('view.title')}
              placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
              readOnly={isReadOnly}
              isLight={true}
              label={t(`ENTER_TITLE`)}
              maxRows={2.125}
              minRows={2.125}
            />
          </FormItem>

          <FormItem error={errors.view && errors.view.description}>
            {/* <InputTextAreaWithTitleCounter
              label={t(`CONTENT_INPUT`)}
              maxRows={17}
              isLight={true}
              placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
              {...register('view.description')}
              readOnly={isReadOnly}
            /> */}
            <InputTextAreaWithTitleCounter
              {...register('view.description')}
              placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
              readOnly={isReadOnly}
              isLight={true}
              label={t(`ENTER_CONTENT`)}
              maxRows={17}
              minRows={2.125}
            />
          </FormItem>
        </Space>
      </Collapse>

      <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
        {values.view && values.view.buttons && (
          <ButtonsEdit
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            nodeId={values.id}
            useCounter={false}
            isDataApi={true}
          />
        )}
      </Collapse>

      <ConnectNodeBottomEdit nodeId={values.id} />
    </div>
  );
};

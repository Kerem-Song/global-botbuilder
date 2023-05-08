import { Button, Col, Collapse, FormItem, Radio, Row, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IDataProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';
import { currencyOptions, reactSelectStyleProduct } from './ProductCardNodeEdit';

export const DataProductCardNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IDataProductCardView>>();
  const [carouselNum, setCarouselNum] = useState<number>(
    Number(watch('view.count')) || 1,
  );
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();

  const { field: carouselPrintOutField } = useController({
    name: 'view.isShuffle',
    control,
  });
  const { field: currencyField } = useController({
    name: `view.currencyUnit`,
    control,
  });

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
      setValue('view.count', carouselNum + 1);
    } else {
      setCarouselNum((prev) => prev - 1);
      setValue('view.count', carouselNum - 1);
    }
  };

  console.log('values in basiccard node edit', values.view);

  useEffect(() => {
    if (watch(`view.count`)) {
      setCarouselNum(watch(`view.count`));
    }
  }, [watch(`view.count`)]);

  return (
    <>
      <Collapse label={t(`VARIABLE_SETTING`)} useSwitch={false}>
        <p className="m-b-8">{t(`DATA_BASIC_CARD_NODE_VARIABLE_INPUT_LABEL`)}</p>
        <FormItem error={errors.view?.itemsRefName}>
          <ParameterSelector
            control={control}
            path={`view.itemsRefName`}
            placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
      </Collapse>

      <Collapse label={t(`DATA_BASIC_CARD_NODE_CAROUSEL_SETTING`)} useSwitch={false}>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_NUMBER`)}</p>
        <div className="dataCardCrouselSlideBtns">
          <Col span={3}>
            <Button
              className="counterBtn negative"
              shape="ghost"
              onClick={() => handleCarouselNum(false)}
              disabled={carouselNum <= 1}
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
              disabled={carouselNum >= 10}
            />
          </Col>
        </div>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                name="view.isShuffle"
                checked={watch('view.isShuffle') === false}
                onChange={() => setValue(`view.isShuffle`, false)}
                ref={carouselPrintOutField.ref}
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_ORDER`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                name="view.isShuffle"
                checked={watch('view.isShuffle') === true}
                onChange={() => setValue(`view.isShuffle`, true)}
                ref={carouselPrintOutField.ref}
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_RANDOM`)}</span>
              </Radio>
            </Col>
          </Row>
        </div>
      </Collapse>

      <div className="node-item-wrap collapse">
        <Collapse label={t(`IMAGE_SETTING`)} useSwitch={false}>
          <FormItem error={errors.view?.imageCtrl?.imageUrl}>
            <ImageSettings
              imageRatio={watch(`view.imageCtrl.aspectRatio`)}
              setImageRatio={setImageRatio}
              imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
              isValid={errors.view?.imageCtrl?.imageUrl ? false : true}
            />
          </FormItem>
        </Collapse>
      </div>
      <div className="node-item-wrap collapse">
        <Collapse label={t(`PROFILE`)} useSwitch={false}>
          <div className="m-b-8">
            <span className="subLabel">{t(`PROFILE_IMAGE_UPLOAD`)} </span>
            <span className="required">*</span>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <FormItem error={errors.view?.profileIconUrl}>
                <Row align="center" gap={12} style={{ margin: 0 }}>
                  <Col span={5} className="itemProfileImg">
                    <ImageFileUploader
                      imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                      isValid={errors.view?.profileIconUrl ? false : true}
                    />
                  </Col>
                  <Col span={18}>
                    <p>{t(`RECOMMENDED_SIZE`)}</p>
                    <p>640 x 640</p>
                  </Col>
                  <ImageInput
                    imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                    registerName={`view.profileIconUrl`}
                  />
                </Row>
              </FormItem>
            </Space>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <FormItem error={errors.view && errors.view.profileName}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_BRAND_NAME`)}
                  required={true}
                  showCount={true}
                  maxLength={15}
                  {...register(`view.profileName`)}
                  textLength={watch(`view.profileName`)?.length || 0}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            </Space>
          </div>
        </Collapse>
      </div>
      <div className="node-item-wrap collapse">
        <div className="m-b-8">
          <Collapse label={t(`PRODUCT_NODE_INFO_SETTING`)} useSwitch={false}>
            <Space direction="vertical">
              <FormItem error={errors.view && errors.view.description}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_PRODUCT_NAME`)}
                  showCount={true}
                  maxLength={30}
                  required={true}
                  {...register(`view.description`)}
                  textLength={watch(`view.description`)?.length || 0}
                  readOnly={isHistoryViewer}
                />
              </FormItem>

              <div className="m-b-8">
                <FormItem error={errors.view && errors.view.retailPriceParam}>
                  <Row justify="space-between" gap={4}>
                    <Col span={16} className="retailPrice">
                      <InputWithTitleCounter
                        className={classNames({
                          'luna-input-error': errors.view?.retailPriceParam,
                        })}
                        label={t(`PRODUCT_NODE_PRICE`)}
                        required={true}
                        {...register(`view.retailPriceParam`, {
                          valueAsNumber: true,
                        })}
                        maxLength={11}
                        readOnly={isHistoryViewer}
                      />
                    </Col>
                    <Col className="productSelectorWrapper" span={8}>
                      <Select
                        className="react-selector"
                        {...currencyField}
                        options={currencyOptions.sort((a, b) =>
                          b.value > a.value ? 1 : -1,
                        )}
                        styles={reactSelectStyleProduct}
                        defaultValue={currencyOptions[0]}
                        value={currencyOptions.find(
                          (item) => item.value === currencyField.value,
                        )}
                        onChange={(options: any) =>
                          currencyField.onChange(options?.value)
                        }
                      />
                    </Col>
                  </Row>
                </FormItem>
              </div>

              <FormItem error={errors.view && errors.view.salePriceParam}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_DISCOUNT`)}
                  {...register(`view.salePriceParam`, {
                    valueAsNumber: true,
                  })}
                  maxLength={11}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            </Space>
          </Collapse>
        </div>
      </div>

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

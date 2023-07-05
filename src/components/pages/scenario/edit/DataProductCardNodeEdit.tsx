import { Button, Col, Collapse, FormItem, Input, Radio, Row, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import {
  IGNodeEditModel,
  IMAGE_CTRL_TYPES,
  ImageAspectRatio,
  PriceDisplayType,
} from '@models';
import { IDataProductCardView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';

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
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IDataProductCardView>>();
  const [carouselNum, setCarouselNum] = useState<number>(
    Number(watch('view.count')) || 1,
  );
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();
  const reactSelectStyle = getReactSelectStyle({});

  const { field: carouselPrintOutField } = useController({
    name: 'view.isShuffle',
    control,
  });
  const { field: priceDisplayTypeField } = useController({
    name: `view.priceDisplayType`,
    control,
  });

  const priceDisplayTypeOptions = [
    { label: t(`DATA_PRODUCT_CARD_NODE_PRICE_DISPLAY_ALL`), value: PriceDisplayType.All },
    {
      label: t(`DATA_PRODUCT_CARD_NODE_PRICE_DISPLAY_RETAIL_PRICE`),
      value: PriceDisplayType.Retail,
    },
    {
      label: t(`DATA_PRODUCT_CARD_NODE_PRICE_DISPLAY_SALE_PRICE`),
      value: PriceDisplayType.Sale,
    },
  ];

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
      setValue('view.count', carouselNum + 1, { shouldDirty: true });
    } else {
      setCarouselNum((prev) => prev - 1);
      setValue('view.count', carouselNum - 1, { shouldDirty: true });
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
              disabled={carouselNum <= 1 || isHistoryViewer}
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
              disabled={carouselNum >= 10 || isHistoryViewer}
            />
          </Col>
        </div>
        <p className="m-b-8">{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                name="view.isShuffle"
                checked={watch('view.isShuffle') === false}
                onChange={() => setValue(`view.isShuffle`, false, { shouldDirty: true })}
                ref={carouselPrintOutField.ref}
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
              isDataCard={true}
            />
          </FormItem>
        </Collapse>
      </div>
      <div className="node-item-wrap collapse">
        <Collapse label={t(`PROFILE`)} useSwitch={false}>
          <div className="m-b-8">
            <span className="subLabel">
              {t(`PROFILE_IMAGE_UPLOAD`)}/{t(`IMAGE_DIRECT_INPUT`)}{' '}
            </span>
            <span className="required">*</span>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <FormItem error={errors.view?.profileIconUrl}>
                <>
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
                  </Row>
                  <ImageInput
                    imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                    registerName={`view.profileIconUrl`}
                    placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
                    isValid={errors.view?.profileIconUrl ? false : true}
                  />
                </>
              </FormItem>
            </Space>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <FormItem error={errors.view && errors.view.profileName}>
                <InputTextAreaWithTitleCounter
                  {...register('view.profileName')}
                  label={t(`PRODUCT_NODE_BRAND_NAME`)}
                  required={true}
                  placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
                  isLight={true}
                  readOnly={isHistoryViewer}
                  maxRows={17}
                  minRows={2.125}
                  isError={errors.view?.profileName ? true : false}
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
              <span className="subLabel">
                {t(`DATA_PRODUCT_CARD_NODE_PRICE_DISPLAY_SETTING`)}
              </span>
              <Select
                className="react-selector"
                {...priceDisplayTypeField}
                options={priceDisplayTypeOptions}
                placeholder={t(`SET_OPTION_NULL`)}
                styles={reactSelectStyle}
                defaultValue={priceDisplayTypeOptions[0]}
                value={priceDisplayTypeOptions.find(
                  (item) => item.value === priceDisplayTypeField.value,
                )}
                onChange={(options: any) =>
                  priceDisplayTypeField.onChange(options?.value)
                }
              />

              <Row justify="space-between" align="flex-start" gap={4}>
                <Col span={16} className="retailPrice">
                  <FormItem error={errors.view?.retailPriceParam}>
                    <InputWithTitleCounter
                      className={classNames({
                        'luna-input-error': errors.view?.retailPriceParam,
                      })}
                      label={t(`PRODUCT_NODE_PRICE`)}
                      required={true}
                      {...register(`view.retailPriceParam`)}
                      isLight={true}
                      readOnly={isHistoryViewer}
                    />
                  </FormItem>
                </Col>
                <Col className="productSelectorWrapper" span={8}>
                  <FormItem error={errors.view?.currencyUnit}>
                    {/* <Input {...register(`view.currencyUnit`)} placeholder="ex.USD" /> */}
                    <InputWithTitleCounter
                      className={classNames({
                        'luna-input-error': errors.view?.currencyUnit,
                      })}
                      label={t(`PRODUCT_NODE_CURRENCY_UNIT`)}
                      required={true}
                      {...register(`view.currencyUnit`)}
                      isLight={true}
                      readOnly={isHistoryViewer}
                    />
                  </FormItem>
                </Col>
              </Row>
              {/* <div className="dataRetailPriceWrapper">
                <div className="dataRetailPrice">
                  <FormItem error={errors.view?.retailPriceParam}>
                    <InputWithTitleCounter
                      className={classNames({
                        'luna-input-error': errors.view?.retailPriceParam,
                      })}
                      label={t(`PRODUCT_NODE_PRICE`)}
                      required={true}
                      {...register(`view.retailPriceParam`)}
                      isLight={true}
                      readOnly={isHistoryViewer}
                      placeholder={t(`DATA_PRODUCT_CARD_PRICE_PLACEHOLDER`)}
                    />
                  </FormItem>
                </div>
                <div className="dataCurrencyUnit">
                  <FormItem error={errors.view?.currencyUnit}>
                    <Input {...register(`view.currencyUnit`)} placeholder="ex.USD" />
                  </FormItem>
                </div>
              </div> */}
              <FormItem error={errors.view && errors.view.discountAmountParam}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_DISCOUNT`)}
                  {...register(`view.discountAmountParam`)}
                  isLight={true}
                  readOnly={isHistoryViewer}
                  placeholder={t(`DATA_PRODUCT_CARD_PRICE_PLACEHOLDER`)}
                />
              </FormItem>
              <FormItem error={errors.view && errors.view.salePriceParam}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_SALE_PRICE`)}
                  {...register(`view.salePriceParam`)}
                  isLight={true}
                  readOnly={isHistoryViewer}
                  placeholder={t(`DATA_PRODUCT_CARD_PRICE_PLACEHOLDER`)}
                />
              </FormItem>
              <FormItem error={errors.view && errors.view.description}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_SET_PRODUCT_NAME`)}
                  required={true}
                  {...register(`view.description`)}
                  isLight={true}
                  readOnly={isHistoryViewer}
                  placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
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
            useCounter={false}
            isDataApi={true}
          />
        )}
      </Collapse>
    </>
  );
};

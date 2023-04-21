import { Button, Col, FormItem, Radio, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IDataProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
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
    Number(watch('view.carousel')) || 1,
  );
  const values = getValues();
  const isHistoryViewer = useHistoryViewerMatch();

  const { field: carouselPrintOutField } = useController({ name: 'view.print', control });
  const { field: currencyField } = useController({
    name: `view.currencyUnit`,
    control,
  });

  const checkPriceRegex = (
    e: React.ChangeEvent<HTMLInputElement>,
    price: 'retailPrice' | 'discountPrice',
  ) => {
    const regex = /^\d{0,8}[.]\d{0,2}$/;
    if (regex.test(e.target.value)) {
      return;
    }
    trigger(`view.${price}`);
  };

  const salePrice =
    Number(watch(`view.retailPrice`)) -
    (watch(`view.discountPrice`) ? Number(watch(`view.discountPrice`)) : 0);

  useEffect(() => {
    if (!watch(`view.retailPrice`)) {
      setValue(`view.retailPrice`, 0);
    }
  }, [watch(`view.retailPrice`)]);

  useEffect(() => {
    setValue(`view.salePrice`, salePrice || 0);
  }, [salePrice]);

  useEffect(() => {
    if (!watch(`view.discountPrice`)) {
      setValue(
        `view.discountPrice`,
        watch(`view.retailPrice`) - watch(`view.salePrice`) || 0,
      );
    }
  }, [salePrice]);

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
      setValue('view.carousel', carouselNum + 1);
    } else {
      setCarouselNum((prev) => prev - 1);
      setValue('view.carousel', carouselNum - 1);
    }
  };

  console.log('values in basiccard node edit', values.view);

  useEffect(() => {
    if (watch(`view.carousel`)) {
      setCarouselNum(watch(`view.carousel`));
    }
  }, [watch(`view.carousel`)]);

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
          <Button
            shape="ghost"
            onClick={() => handleCarouselNum(false)}
            disabled={carouselNum <= 1}
          >
            -
          </Button>
          <span>{watch(`view.carousel`)}</span>
          <Button
            shape="ghost"
            onClick={() => handleCarouselNum(true)}
            disabled={carouselNum >= 10}
          >
            +
          </Button>
        </div>
        <p>{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-8">
            <Col span={12} className="radioContainer">
              <Radio
                name="view.print"
                checked={watch('view.print') === 'order'}
                onChange={() => setValue(`view.print`, 'order')}
                ref={carouselPrintOutField.ref}
              >
                <span>{t(`DATA_CARD_NODE_CAROUSEL_PRINT_ORDER`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                name="view.print"
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
              <FormItem error={errors.view?.imageCtrl?.imageUrl}>
                <Row align="center" gap={12} style={{ margin: 0 }}>
                  <Col span={8} className="itemProfileImg">
                    <ImageFileUploader
                      imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                      isValid={errors.view?.profileIconUrl ? false : true}
                    />
                  </Col>
                  <Col span={14}>
                    <p>{t(`RECOMMENDED_SIZE`)}</p>
                    <p>640 x 640</p>
                  </Col>
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
                <FormItem error={errors.view && errors.view.retailPrice}>
                  <Row justify="space-between">
                    <Col span={16} className="retailPrice">
                      <InputWithTitleCounter
                        className={classNames({
                          'luna-input-error': errors.view?.retailPrice,
                        })}
                        label={t(`PRODUCT_NODE_PRICE`)}
                        required={true}
                        {...register(`view.retailPrice`, {
                          valueAsNumber: true,
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            checkPriceRegex(e, 'retailPrice'),
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

              <FormItem error={errors.view && errors.view.discountPrice}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_DISCOUNT`)}
                  {...register(`view.discountPrice`, {
                    valueAsNumber: true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      checkPriceRegex(e, 'discountPrice'),
                  })}
                  maxLength={11}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            </Space>
          </Collapse>
        </div>
      </div>

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

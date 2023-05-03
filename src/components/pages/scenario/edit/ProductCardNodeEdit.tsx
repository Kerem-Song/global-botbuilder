import { Col, Collapse, FormItem, Row, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'JPY', label: 'JPY' },
  { value: 'KRW', label: 'KRW' },
];

export const reactSelectStyleProduct: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '109px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '40px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
  }),
  indicatorsContainer: () => ({}),
  valueContainer: (provided) => ({
    ...provided,
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: '#000',
  }),
  input: (provided) => ({
    ...provided,
    color: 'transparent',
    textShadow: '0 0 0 black',
  }),
  option: (provided) => ({
    ...provided,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',

    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 400,
    color: '#757575',
    lineHeight: 1.5,
    backgroundColor: 'white',
    ':hover': {
      color: '#222222',
      backgroundColor: '#ECF2FF',
      borderRadius: '6px',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: '#222222',
    overflow: 'unset',
    textOverflow: 'unset',
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px solid #DCDCDC',
    borderRadius: '8px',
  }),
};

export const ProductCardNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardView>>();
  const values = getValues();
  console.log('value.view', values.view);
  const isHistoryViewer = useHistoryViewerMatch();
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

  useEffect(() => {
    if (!watch(`view.retailPrice`)) {
      setValue(`view.retailPrice`, 0);
    }
  }, [watch(`view.retailPrice`)]);
  return (
    <>
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
                  <Col span={19}>
                    <p>{t(`RECOMMENDED_SIZE`)}</p>
                    <p>640 x 640</p>
                  </Col>
                  <ImageInput imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL} />
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
                  <Row justify="space-between" gap={4}>
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

import { Col, FormItem, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'KRW', label: 'KRW' },
  { value: 'JPY', label: 'JPY' },
];

const reactSelectStyle: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '60px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '34px',
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
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const { field: currencyField } = useController({
    name: `view.currencyUnit`,
    control,
  });

  const salePrice =
    Number(watch(`view.retailPrice`)) - Number(watch(`view.discountPrice`));

  useEffect(() => {
    setValue(`view.salePrice`, salePrice);
  }, [salePrice]);

  return (
    <>
      <div className="node-item-wrap collapse">
        <Collapse label={t(`IMAGE_SETTING`)} useSwitch={false}>
          <ImageSettings
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            setImageRatio={setImageRatio}
            imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
          />
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
              <Row align="center" gap={12} style={{ margin: 0 }}>
                <Col span={8} className="itemProfileImg">
                  <ImageFileUploader
                    imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                  />
                </Col>
                <Col span={14}>
                  <p>{t(`RECOMMENDED_SIZE`)}</p>
                  <p>640 x 640</p>
                </Col>
              </Row>
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
                  maxLength={15}
                  required={true}
                  {...register(`view.description`)}
                  textLength={watch(`view.description`)?.length || 0}
                />
              </FormItem>

              <div className="m-b-8">
                <Row justify="space-between">
                  <Col span={17}>
                    <FormItem error={errors.view && errors.view.retailPrice}>
                      <InputWithTitleCounter
                        label={t(`PRODUCT_NODE_PRICE`)}
                        required={true}
                        {...register(`view.retailPrice`, { valueAsNumber: true })}
                      />
                    </FormItem>
                  </Col>
                  <Col className="productSelectorWrapper">
                    <Select
                      {...currencyField}
                      options={currencyOptions}
                      styles={reactSelectStyle}
                      defaultValue={currencyOptions[0]}
                      value={currencyOptions.find(
                        (item) => item.value === currencyField.value,
                      )}
                      onChange={(options: any) => currencyField.onChange(options?.value)}
                    />
                  </Col>
                </Row>
              </div>

              <FormItem error={errors.view && errors.view.discountPrice}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_DISCOUNT`)}
                  {...register(`view.discountPrice`, { valueAsNumber: true })}
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

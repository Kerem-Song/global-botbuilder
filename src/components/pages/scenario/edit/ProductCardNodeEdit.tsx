import { Col, FormItem, Input, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageSettings } from './ImageSettings';
import { ItemProfileImageSetting } from './ItemProfileImageSetting';

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
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const { field: currencyField } = useController({
    name: `view.currencyUnit`,
    control,
  });

  return (
    <>
      <div className="node-item-wrap collapse">
        <Collapse label={'이미지 설정'} useSwitch={false}>
          {values.view?.imageCtrl && (
            <ImageSettings
              imageRatio={imageRatio}
              setImageRatio={setImageRatio}
              imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
            />
          )}
        </Collapse>
      </div>
      <div className="node-item-wrap collapse">
        <Collapse label={'프로필'} useSwitch={false}>
          <div className="m-b-8">
            <span className="subLabel">프로필 이미지 업로드 </span>
            <span className="required">*</span>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <Row align="center" gap={12} style={{ margin: 0 }}>
                <Col span={8}>
                  <ItemProfileImageSetting
                    imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                  />
                </Col>
                <Col span={14}>
                  <p>Recommended size</p>
                  <p>640 x 640</p>
                </Col>
              </Row>
            </Space>
            <ItemProfileImageSetting
              imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
            />
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <span className="label">브랜드 이름</span>
              <FormItem error={errors.view && errors.view.profileName}>
                <Input {...register(`view.profileName`)} />
              </FormItem>
            </Space>
          </div>
        </Collapse>
      </div>
      <div className="node-item-wrap collapse">
        <div className="m-b-8">
          <Collapse label={'상품 정보 설정'} useSwitch={false}>
            <Space direction="vertical">
              <p>
                <span className="label">상품명 </span>
                <span className="required">*</span>
              </p>
              <FormItem error={errors.view && errors.view.description}>
                <Input {...register(`view.description`)} />
              </FormItem>
              <p>
                <span className="label">가격 </span>
                <span className="required">*</span>
              </p>
              <div className="m-b-8">
                <Row justify="space-between">
                  <Col span={17}>
                    <FormItem error={errors.view && errors.view.retailPrice}>
                      <Input {...register(`view.retailPrice`)} />
                    </FormItem>
                  </Col>
                  <Col>
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

              <span className="label">할인</span>
              <FormItem error={errors.view && errors.view.salePrice}>
                <Input {...register(`view.salePrice`)} />
              </FormItem>
            </Space>
          </Collapse>
        </div>
      </div>
      <Collapse label={'버튼'} useSwitch={false}>
        {values.view && values.view.buttons && <ButtonsEdit />}
      </Collapse>
    </>
  );
};

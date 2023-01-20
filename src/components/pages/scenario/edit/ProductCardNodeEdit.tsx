import { icImg } from '@assets';
import { Col, Divider, Input, Radio, Row, Space } from '@components';
import { IButtonType } from '@models';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

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
  const { register, getValues, control } = useFormContext();
  const values = getValues();
  console.log('value.view', values.view);

  const { field: currencyField } = useController({
    name: `view.currency`,
    control,
  });
  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">이미지 설정</span>
          </Space>
          <Divider />
        </div>
        <Space direction="vertical">
          <div className="m-b-8">
            <span className="subLabel">이미지 업로드 </span>
            <span className="required">*</span>
          </div>

          <span className="subLabel">이미지 타입</span>
          <Row>
            <Col span={12}>
              <Radio>
                <span>직사각형</span>
              </Radio>
            </Col>
            <Col span={12}>
              <Radio>
                <span>정사각형</span>
              </Radio>
            </Col>
          </Row>
          <div
            style={{
              height: '118px',
              border: '1px dashed #DCDCDC',
              background: '#FFFFFF',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                textAlign: 'center',
                width: '200px',
                bottom: '50%',
                right: '50%',
                transform: 'translate(50%, 50%)',
              }}
            >
              <img src={icImg} alt="icImg" />
              <br />
              Recommended
              <br />
              Rectangular: 800 x 400
            </div>
          </div>
        </Space>
      </div>
      <div className="node-item-wrap">
        <Space style={{ alignItems: 'center' }}>
          <span className="label">프로필</span>
        </Space>
        <Divider />

        <div className="m-b-8">
          <span className="subLabel">프로필 이미지 업로드 </span>
          <span className="required">*</span>
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <Row align="center" gap={12} style={{ margin: 0 }}>
              <Col span={8} className="img"></Col>
              <Col span={14}>
                <p>Recommended size</p>
                <p>640 x 640</p>
              </Col>
            </Row>
          </Space>
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <span className="label">브랜드 이름</span>
            <Input
              {...register(`view.profile.brandName`)}
              value={values.view?.brandName || ''}
            />
          </Space>
        </div>
      </div>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">상품 정보 설정</span>
          </Space>
          <Divider />
          <Space direction="vertical">
            <p className="m-b-8">
              <span className="label">상품명 </span>
              <span className="required">*</span>
            </p>
            <Input
              {...register(`view.productName`)}
              value={values.view?.productName || ''}
            />
            <p className="m-b-8">
              <span className="label">가격 </span>
              <span className="required">*</span>
            </p>
            <div className="m-b-8">
              <Row justify="space-between">
                <Col span={17}>
                  <Input {...register(`view.price`)} value={values.view?.price || ''} />
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
            <Input {...register(`view.discount`)} value={values.view?.discountPrice} />
          </Space>
        </div>
      </div>
      {values.view &&
        values.view.buttons &&
        values.view.buttons.map((b: IButtonType, index: number) => {
          return (
            <div className="node-item-wrap" key={b.id}>
              <p className="m-b-8">
                <span className="label">버튼</span>
                <span className="required">*</span>
              </p>
              <Space direction="vertical">
                <span className="subLabel">버튼명</span>
                <Input
                  {...register(`view.buttons[${index}].label`)}
                  value={b.label || ''}
                />
                <span className="subLabel">버튼타입</span>
              </Space>
            </div>
          );
        })}
    </>
  );
};

import { Col, FormItem, Input, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IProductCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
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

export const ProductCardCarouselNodeEdit = () => {
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardCarouselView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];

  const { field: currencyField } = useController({
    name: `view.childrenViews.${index}.currencyUnit`,
    control,
  });

  useEffect(() => {
    console.log('product card caro index', index);
  }, [index]);

  const salePrice =
    Number(watch(`view.childrenViews.${index}.retailPrice`)) -
    (watch(`view.childrenViews.${index}.discountPrice`)
      ? Number(watch(`view.childrenViews.${index}.discountPrice`))
      : 0);

  useEffect(() => {
    setValue(`view.childrenViews.${index}.salePrice`, salePrice);
  });
  return (
    <>
      {watch(`view.childrenViews.${index}.id`) && (
        <>
          <div className="node-item-wrap collapse">
            <Collapse label={t(`IMAGE_SETTING`)} useSwitch={false}>
              <ImageSettings
                imageRatio={watch(`view.childrenViews.${index}.imageCtrl.aspectRatio`)}
                setImageRatio={setImageRatio}
                imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
                index={index}
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
                    <Col span={7} className="itemProfileImg">
                      <ImageFileUploader
                        imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL}
                        index={index}
                      />
                    </Col>
                    <Col span={15}>
                      <p>{t(`RECOMMENDED_SIZE`)}</p>
                      <p>640 x 640</p>
                    </Col>
                  </Row>
                </Space>
              </div>
              <div className="m-b-8">
                <Space direction="vertical">
                  <FormItem
                    error={
                      errors.view &&
                      errors.view.childrenViews &&
                      errors.view.childrenViews[index]?.profileName
                    }
                  >
                    <InputWithTitleCounter
                      label={t(`PRODUCT_NODE_BRAND_NAME`)}
                      required={true}
                      showCount={true}
                      maxLength={15}
                      isLight={true}
                      {...register(`view.childrenViews.${index}.profileName`)}
                      textLength={
                        watch(`view.childrenViews.${index}.profileName`)?.length || 0
                      }
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
                  <FormItem
                    error={
                      errors.view &&
                      errors.view.childrenViews &&
                      errors.view.childrenViews[index]?.description
                    }
                  >
                    <InputWithTitleCounter
                      label={t(`PRODUCT_NODE_PRODUCT_NAME`)}
                      showCount={true}
                      maxLength={15}
                      required={true}
                      {...register(`view.childrenViews.${index}.description`)}
                      textLength={
                        watch(`view.childrenViews.${index}.description`)?.length || 0
                      }
                    />
                  </FormItem>

                  <div className="m-b-8">
                    <Row justify="space-between">
                      <Col span={17}>
                        <FormItem
                          error={errors.view?.childrenViews?.[index]?.retailPrice}
                        >
                          <InputWithTitleCounter
                            label={t(`PRODUCT_NODE_PRICE`)}
                            required={true}
                            {...register(`view.childrenViews.${index}.retailPrice`, {
                              valueAsNumber: true,
                            })}
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
                          onChange={(options: any) =>
                            currencyField.onChange(options?.value)
                          }
                        />
                      </Col>
                    </Row>
                  </div>

                  <FormItem error={errors.view?.childrenViews?.[index]?.discountPrice}>
                    <InputWithTitleCounter
                      label={t(`PRODUCT_NODE_DISCOUNT`)}
                      {...register(`view.childrenViews.${index}.discountPrice`, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormItem>
                </Space>
              </Collapse>
            </div>
          </div>
          <Collapse label={t(`BUTTON`)} useSwitch={false}>
            {values.view && values.view.childrenViews[index].buttons && (
              <ButtonsEdit
                index={index}
                isCarousel={true}
                imageRatio={watch(`view.childrenViews.${index}.imageCtrl.aspectRatio`)}
                nodeId={values.id}
              />
            )}
          </Collapse>
        </>
      )}
    </>
  );
};

import { Col, FormItem, Input, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage, useRootState } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { IProductCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'JPY', label: 'JPY' },
  { value: 'KRW', label: 'KRW' },
];

const reactSelectStyle: StylesConfig = {
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

export const ProductCardCarouselNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardCarouselView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];
  const isHistoryViewer = useHistoryViewerMatch();
  const { field: currencyField } = useController({
    name: `view.childrenViews.${index}.currencyUnit`,
    control,
  });
  const { fields: childrenViewsField } = useFieldArray({
    name: `view.childrenViews`,
    control,
  });

  const checkPriceRegex = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    price: 'retailPrice' | 'discountPrice',
  ) => {
    const regex = /^\d{0,8}[.]\d{0,2}?$/;
    if (regex.test(e.target.value)) {
      return;
    }
    trigger(`view.childrenViews.${index}.${price}`);
  };

  useEffect(() => {
    trigger();
  }, [index]);

  const salePrice =
    Number(watch(`view.childrenViews.${index}.retailPrice`)) -
    (watch(`view.childrenViews.${index}.discountPrice`)
      ? Number(watch(`view.childrenViews.${index}.discountPrice`))
      : 0);

  useEffect(() => {
    setValue(`view.childrenViews.${index}.salePrice`, salePrice || 0);
  }, [salePrice]);

  useEffect(() => {
    if (watch(`view.childrenViews`)?.length === index) {
      return;
    }
    setValue(
      `view.childrenViews.${index}.discountPrice`,
      watch(`view.childrenViews.${index}.retailPrice`) -
        watch(`view.childrenViews.${index}.salePrice`) || 0,
    );
  }, [watch(`view.childrenViews.${index}.discountPrice`)]);

  useEffect(() => {
    if (!watch(`view.childrenViews.${index}.retailPrice`)) {
      setValue(`view.childrenViews.${index}.retailPrice`, 0);
    }
  }, [watch(`view.childrenViews.${index}.retailPrice`)]);

  return (
    <>
      {watch(`view.childrenViews.${index}.id`) &&
        childrenViewsField.map(
          (childrenView, i) =>
            index === i && (
              <div key={childrenView.id}>
                <div className="node-item-wrap collapse">
                  <Collapse label={t(`IMAGE_SETTING`)} useSwitch={false} index={index}>
                    <FormItem
                      error={errors.view?.childrenViews?.[index]?.imageCtrl?.imageUrl}
                    >
                      <ImageSettings
                        imageRatio={watch(
                          `view.childrenViews.${index}.imageCtrl.aspectRatio`,
                        )}
                        setImageRatio={setImageRatio}
                        imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
                        index={index}
                        isValid={
                          errors.view?.childrenViews?.[index]?.imageCtrl?.imageUrl
                            ? false
                            : true
                        }
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
                        <FormItem
                          error={errors.view?.childrenViews?.[index]?.imageCtrl?.imageUrl}
                        >
                          <Row align="center" gap={12} style={{ margin: 0 }}>
                            <Col span={5} className="itemProfileImg">
                              <ImageFileUploader
                                imageCtrl={
                                  IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL
                                }
                                index={index}
                                isValid={
                                  errors.view?.childrenViews?.[index]?.profileIconUrl
                                    ? false
                                    : true
                                }
                              />
                            </Col>
                            <Col span={19}>
                              <p>{t(`RECOMMENDED_SIZE`)}</p>
                              <p>640 x 640</p>
                            </Col>
                            <span className="subLabel">{t(`IMAGE_DIRECT_INPUT`)}</span>
                            <Input
                              {...register(`view.childrenViews.${index}.profileIconUrl`)}
                              placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
                              readOnly={isHistoryViewer}
                            />
                          </Row>
                        </FormItem>
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
                              watch(`view.childrenViews.${index}.profileName`)?.length ||
                              0
                            }
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
                            maxLength={30}
                            required={true}
                            {...register(`view.childrenViews.${index}.description`)}
                            textLength={
                              watch(`view.childrenViews.${index}.description`)?.length ||
                              0
                            }
                            readOnly={isHistoryViewer}
                          />
                        </FormItem>

                        <div className="m-b-8">
                          <FormItem
                            error={errors.view?.childrenViews?.[index]?.retailPrice}
                          >
                            <Row justify="space-between" gap={4}>
                              <Col span={16} className="retailPrice">
                                <InputWithTitleCounter
                                  className={classNames({
                                    'luna-input-error':
                                      errors.view?.childrenViews?.[index]?.retailPrice,
                                  })}
                                  label={t(`PRODUCT_NODE_PRICE`)}
                                  required={true}
                                  {...register(
                                    `view.childrenViews.${index}.retailPrice`,
                                    {
                                      valueAsNumber: true,
                                      onChange: (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) => checkPriceRegex(e, index, 'retailPrice'),
                                    },
                                  )}
                                  maxLength={11}
                                  readOnly={isHistoryViewer}
                                />
                              </Col>
                              <Col className="productSelectorWrapper" span={8}>
                                <Select
                                  className="react-selector"
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
                          </FormItem>
                        </div>

                        <FormItem
                          error={errors.view?.childrenViews?.[index]?.discountPrice}
                        >
                          <InputWithTitleCounter
                            label={t(`PRODUCT_NODE_DISCOUNT`)}
                            {...register(
                              `view.childrenViews.${index}.discountPrice`,

                              {
                                valueAsNumber: true,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                  checkPriceRegex(e, index, 'discountPrice'),
                              },
                            )}
                            maxLength={11}
                            readOnly={isHistoryViewer}
                          />
                        </FormItem>
                      </Space>
                    </Collapse>
                  </div>
                </div>
                <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
                  {values.view && values.view.childrenViews[index].buttons && (
                    <ButtonsEdit
                      index={index}
                      isCarousel={true}
                      imageRatio={watch(
                        `view.childrenViews.${index}.imageCtrl.aspectRatio`,
                      )}
                      nodeId={values.id}
                    />
                  )}
                </Collapse>
              </div>
            ),
        )}
    </>
  );
};

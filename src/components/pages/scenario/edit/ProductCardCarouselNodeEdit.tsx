import { Col, Collapse, FormItem, Input, Row, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IProductCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

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
    resetField,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardCarouselView>>();
  const values = getValues();
  console.log('value.view', values.view);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];
  const isHistoryViewer = useHistoryViewerMatch();

  const { fields: childrenViewsField } = useFieldArray({
    name: `view.childrenViews`,
    control,
  });

  const checkPriceRegex = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    price: 'retailPrice' | 'discountAmount' | 'salePrice',
  ) => {
    const regex = /^\d{0,8}[.]\d{0,2}?$/;
    if (regex.test(e.target.value)) {
      return;
    }
    trigger(`view.childrenViews.${index}.${price}`);
  };

  // useEffect(() => {
  //   resetField(`view.childrenViews.${index}.currencyUnit`, { keepDirty: true });
  // }, [index]);

  const salePrice =
    Number(watch(`view.childrenViews.${index}.retailPrice`)) -
    (watch(`view.childrenViews.${index}.discountAmount`)
      ? Number(watch(`view.childrenViews.${index}.discountAmount`))
      : 0);

  useEffect(() => {
    setValue(`view.childrenViews.${index}.salePrice`, salePrice || 0, {
      shouldDirty: true,
    });
  }, [salePrice]);

  useEffect(() => {
    if (watch(`view.childrenViews`)?.length === index) {
      return;
    }
    setValue(
      `view.childrenViews.${index}.discountAmount`,
      watch(`view.childrenViews.${index}.retailPrice`) -
        watch(`view.childrenViews.${index}.salePrice`) || 0,
      { shouldDirty: true },
    );
  }, [watch(`view.childrenViews.${index}.discountAmount`)]);

  // useEffect(() => {
  //   if (!watch(`view.childrenViews.${index}.retailPrice`)) {
  //     setValue(`view.childrenViews.${index}.retailPrice`, 0);
  //   }
  // }, [watch(`view.childrenViews.${index}.retailPrice`)]);

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
                    <div className="m-b-12">
                      <span className="subLabel">
                        {t(`PROFILE_IMAGE_UPLOAD`)}/{t(`IMAGE_DIRECT_INPUT`)}{' '}
                      </span>
                      <span className="required">*</span>
                    </div>
                    <div className="m-b-12">
                      <Space direction="vertical" gap={12}>
                        <FormItem
                          error={errors.view?.childrenViews?.[index]?.profileIconUrl}
                        >
                          <>
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
                            </Row>
                            <ImageInput
                              imageCtrl={
                                IMAGE_CTRL_TYPES.PRODUCT_CAROUSEL_PROFILE_ICON_URL
                              }
                              index={index}
                              registerName={`view.childrenViews.${index}.profileIconUrl`}
                              placeholder={t(`IMAGE_INPUT_PLACEHOLDER`)}
                              isValid={
                                errors.view?.childrenViews?.[index]?.profileIconUrl
                                  ? false
                                  : true
                              }
                              isSmall={true}
                            />
                          </>
                        </FormItem>
                      </Space>
                    </div>
                    <div className="m-b-12">
                      <Space direction="vertical" gap={12}>
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
                            maxLength={40}
                            isLight={true}
                            {...register(`view.childrenViews.${index}.profileName`)}
                            textLength={
                              watch(`view.childrenViews.${index}.profileName`)?.length ||
                              0
                            }
                            placeholder={t(`PRODUCT_NODE_BRAND_NAME_PLACEHOLDER`)}
                            readOnly={isHistoryViewer}
                          />
                        </FormItem>
                      </Space>
                    </div>
                  </Collapse>
                </div>
                <div className="node-item-wrap collapse">
                  <div className="m-b-12">
                    <Collapse label={t(`PRODUCT_NODE_INFO_SETTING`)} useSwitch={false}>
                      <Space direction="vertical" gap={12}>
                        <FormItem
                          error={
                            errors.view &&
                            errors.view.childrenViews &&
                            errors.view.childrenViews[index]?.description
                          }
                        >
                          <InputWithTitleCounter
                            label={t(`PRODUCT_NODE_SET_PRODUCT_NAME`)}
                            showCount={true}
                            maxLength={40}
                            required={true}
                            {...register(`view.childrenViews.${index}.description`)}
                            textLength={
                              watch(`view.childrenViews.${index}.description`)?.length ||
                              0
                            }
                            isLight={true}
                            readOnly={isHistoryViewer}
                            placeholder={t(`PRODUCT_NODE_SET_PRODUCT_NAME_PLACEHOLDER`)}
                          />
                        </FormItem>

                        <Row justify="space-between" gap={4}>
                          <Col span={16} className="retailPrice">
                            <FormItem
                              error={errors.view?.childrenViews?.[index]?.retailPrice}
                            >
                              <InputWithTitleCounter
                                className={classNames({
                                  'luna-input-error':
                                    errors.view?.childrenViews?.[index]?.retailPrice,
                                })}
                                label={t(`PRODUCT_NODE_PRICE`)}
                                required={true}
                                {...register(`view.childrenViews.${index}.retailPrice`, {
                                  setValueAs: (v) => {
                                    return v === '' ? undefined : parseFloat(v);
                                  },
                                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                    checkPriceRegex(e, index, 'retailPrice'),
                                })}
                                maxLength={11}
                                isLight={true}
                                readOnly={isHistoryViewer}
                              />
                            </FormItem>
                          </Col>
                          <Col className="productSelectorWrapper" span={8}>
                            <FormItem
                              error={errors.view?.childrenViews?.[index]?.currencyUnit}
                            >
                              <InputWithTitleCounter
                                className={classNames({
                                  'luna-input-error':
                                    errors.view?.childrenViews?.[index]?.currencyUnit,
                                })}
                                label={t(`PRODUCT_NODE_CURRENCY_UNIT`)}
                                required={true}
                                {...register(`view.childrenViews.${index}.currencyUnit`)}
                                placeholder="ex.USD"
                                isLight={true}
                                readOnly={isHistoryViewer}
                                maxLength={155}
                              />
                            </FormItem>
                          </Col>
                        </Row>

                        <FormItem
                          error={errors.view?.childrenViews?.[index]?.discountAmount}
                        >
                          <InputWithTitleCounter
                            label={t(`PRODUCT_NODE_DISCOUNT`)}
                            {...register(
                              `view.childrenViews.${index}.discountAmount`,

                              {
                                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                  checkPriceRegex(e, index, 'discountAmount'),
                              },
                            )}
                            maxLength={11}
                            isLight={true}
                            readOnly={isHistoryViewer}
                          />
                        </FormItem>
                        {/* <FormItem
                          error={errors.view?.childrenViews?.[index]?.discountAmount}
                        >
                          <InputWithTitleCounter
                            label={t(`PRODUCT_NODE_SALE_PRICE`)}
                            {...register(
                              `view.childrenViews.${index}.salePrice`,

                              {
                                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                  checkPriceRegex(e, index, 'salePrice'),
                              },
                            )}
                            maxLength={11}
                            isLight={true}
                            readOnly={isHistoryViewer}
                          />
                        </FormItem> */}
                        <input
                          type="hidden"
                          {...register(
                            `view.childrenViews.${index}.salePrice`,

                            {
                              setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                checkPriceRegex(e, index, 'salePrice'),
                            },
                          )}
                          maxLength={11}
                        />
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
                      useCounter={true}
                    />
                  )}
                </Collapse>
                <ConnectNodeBottomEdit nodeId={values.id} />
              </div>
            ),
        )}
    </>
  );
};

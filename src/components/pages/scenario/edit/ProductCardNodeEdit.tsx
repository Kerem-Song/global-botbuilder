import { Col, Collapse, FormItem, Row, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IProductCardView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const ProductCardNodeEdit = () => {
  useNodeEditSave();
  const { t, isReadOnly } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,

    watch,
    setValue,
    trigger,

    formState: { errors },
  } = useFormContext<IGNodeEditModel<IProductCardView>>();
  const values = getValues();

  const checkPriceRegex = (
    e: React.ChangeEvent<HTMLInputElement>,
    price: 'retailPrice' | 'discountAmount' | 'salePrice',
  ) => {
    const regex = /^\d{0,8}[.]\d{0,2}$/;
    if (regex.test(e.target.value)) {
      return;
    }
    trigger(`view.${price}`);
  };

  const salePrice =
    Number(watch(`view.retailPrice`)) -
    (watch(`view.discountAmount`) ? Number(watch(`view.discountAmount`)) : 0);

  useEffect(() => {
    setValue(`view.salePrice`, salePrice || 0, { shouldDirty: false });
  }, [salePrice]);

  // useEffect(() => {
  //   if (!watch(`view.discountAmount`)) {
  //     setValue(
  //       `view.discountAmount`,
  //       watch(`view.retailPrice`) - watch(`view.salePrice`) || 0,
  //       { shouldDirty: true },
  //     );
  //   }
  // }, [salePrice]);

  return (
    <div key={values.id}>
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
          <div className="m-b-12">
            <span className="subLabel">
              {t(`PROFILE_IMAGE_UPLOAD`)}/{t(`IMAGE_DIRECT_INPUT`)}{' '}
            </span>
            <span className="required">*</span>
          </div>
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <FormItem error={errors.view?.profileIconUrl}>
                <>
                  <Row align="center" gap={12} className="itemProfileWrapper">
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
                  </Row>
                  <ImageInput
                    imageCtrl={IMAGE_CTRL_TYPES.PRODUCT_PROFILE_ICON_URL}
                    registerName={`view.profileIconUrl`}
                    placeholder={t(`IMAGE_INPUT_PLACEHOLDER`)}
                    isValid={errors.view?.profileIconUrl ? false : true}
                    isSmall={true}
                  />
                </>
              </FormItem>
            </Space>
          </div>
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <FormItem error={errors.view && errors.view.profileName}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_BRAND_NAME`)}
                  required={true}
                  showCount={true}
                  maxLength={40}
                  isLight={true}
                  {...register(`view.profileName`)}
                  textLength={watch(`view.profileName`)?.length || 0}
                  placeholder={t(`PRODUCT_NODE_BRAND_NAME_PLACEHOLDER`)}
                  readOnly={isReadOnly}
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
              <Row justify="space-between" gap={4}>
                <Col span={16} className="retailPrice">
                  <FormItem error={errors.view && errors.view.retailPrice}>
                    <InputWithTitleCounter
                      className={classNames({
                        'luna-input-error': errors.view?.retailPrice,
                      })}
                      label={t(`PRODUCT_NODE_PRICE`)}
                      required={true}
                      {...register(`view.retailPrice`, {
                        setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          checkPriceRegex(e, 'retailPrice'),
                      })}
                      maxLength={11}
                      isLight={true}
                      readOnly={isReadOnly}
                    />
                  </FormItem>
                </Col>
                <Col className="productSelectorWrapper" span={8}>
                  <FormItem error={errors.view?.currencyUnit}>
                    <InputWithTitleCounter
                      className={classNames({
                        'luna-input-error': errors.view?.currencyUnit,
                      })}
                      label={t(`PRODUCT_NODE_CURRENCY_UNIT`)}
                      required={true}
                      {...register(`view.currencyUnit`)}
                      isLight={true}
                      readOnly={isReadOnly}
                      placeholder={'ex.USD'}
                      maxLength={155}
                    />
                  </FormItem>
                </Col>
              </Row>
              <FormItem error={errors.view && errors.view.discountAmount}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_DISCOUNT`)}
                  {...register(`view.discountAmount`, {
                    setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      checkPriceRegex(e, 'discountAmount'),
                  })}
                  maxLength={11}
                  isLight={true}
                  readOnly={isReadOnly}
                />
              </FormItem>
              <FormItem error={errors.view && errors.view.description}>
                <InputWithTitleCounter
                  label={t(`PRODUCT_NODE_SET_PRODUCT_NAME`)}
                  showCount={true}
                  maxLength={40}
                  required={true}
                  {...register(`view.description`)}
                  textLength={watch(`view.description`)?.length || 0}
                  isLight={true}
                  readOnly={isReadOnly}
                  placeholder={t(`PRODUCT_NODE_SET_PRODUCT_NAME_PLACEHOLDER`)}
                />
              </FormItem>

              <input
                type="hidden"
                {...register(`view.salePrice`, {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    checkPriceRegex(e, 'salePrice'),
                })}
                maxLength={11}
              />
            </Space>
          </Collapse>
        </div>
      </div>
      <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
        {values.view && values.view.buttons && (
          <ButtonsEdit
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            nodeId={values.id}
            useCounter={true}
          />
        )}
      </Collapse>

      <ConnectNodeBottomEdit nodeId={values.id} />
    </div>
  );
};

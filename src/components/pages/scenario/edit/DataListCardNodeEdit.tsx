import { Button, Col, Collapse, FormItem, Radio, Row, Space } from '@components';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IDataListCardView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';

export const DataListCardNodeEdit = () => {
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
  } = useFormContext<IGNodeEditModel<IDataListCardView>>();
  const [carouselNum, setCarouselNum] = useState<number>(
    Number(watch('view.count')) || 1,
  );
  const values = getValues();
  console.log('list card node edit value.view', values.view);
  const isHistoryViewer = useHistoryViewerMatch();
  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
    control,
  });
  const { field: carouselPrintOutField } = useController({
    name: 'view.isShuffle',
    control,
  });

  const handleAddListButton = () => {
    console.log('handle add list btn');

    if (fields.length < 5) {
      append(nodeDefaultHelper.createDefaultListCardItem(fields.length));
    }
  };

  const handleDeleteListButton = (index: number) => {
    remove(index);
  };

  const handleCarouselNum = (button: boolean) => {
    if (button) {
      setCarouselNum((prev) => prev + 1);
      setValue('view.count', carouselNum + 1, { shouldDirty: true });
    } else {
      setCarouselNum((prev) => prev - 1);
      setValue('view.count', carouselNum - 1, { shouldDirty: true });
    }
  };

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
        <Row className="dataCardCrouselSlideBtns">
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
        </Row>
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

      <div className="node-item-wrap">
        <FormItem error={errors.view?.header}>
          <InputWithTitleCounter
            label={t(`LIST_NODE_HEAD_TITLE_SETTING`)}
            required={true}
            {...register('view.header')}
            readOnly={isHistoryViewer}
            placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
          />
        </FormItem>
      </div>
      <Collapse
        label={t(`LIST_NODE_HEAD_IMAGE_SETTING`)}
        useSwitch={true}
        field={'useImageCtrl'}
      >
        {(watch(`view.useImageCtrl`) || watch(`view.imageCtrl.imageUrl`)) && (
          <FormItem error={errors.view?.imageCtrl?.imageUrl}>
            <ImageSettings
              imageRatio={watch(`view.imageCtrl.aspectRatio`)}
              setImageRatio={setImageRatio}
              imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
              isValid={errors.view?.imageCtrl?.imageUrl ? false : true}
              isDataCard={true}
            />
          </FormItem>
        )}
      </Collapse>
      <Collapse label={t(`LIST_SETTING`)} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <div className="m-b-12">
              <Space direction="vertical">
                <span className="label">
                  <FormItem error={errors.view?.items?.[i]?.title}>
                    {/* <InputWithTitleCounter
                      label={t(`TITLE_INPUT`)}
                      required={true}
                      isLight={true}
                      {...register(`view.items.${i}.title`)}
                      readOnly={isHistoryViewer}
                    /> */}
                    <InputTextAreaWithTitleCounter
                      {...register(`view.items.${i}.title`)}
                      label={t(`ENTER_TITLE`)}
                      required={true}
                      placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
                      readOnly={isHistoryViewer}
                      isLight={true}
                      maxRows={2.125}
                      minRows={2.125}
                    />
                  </FormItem>
                </span>
              </Space>
            </div>
            <div className="m-b-12">
              <Space direction="vertical">
                <span className="label">
                  {/* <InputWithTitleCounter
                    label={t(`CONTENT_INPUT`)}
                    isLight={true}
                    {...register(`view.items.${i}.description`)}
                    readOnly={isHistoryViewer}
                  /> */}
                  <InputTextAreaWithTitleCounter
                    {...register(`view.items.${i}.description`)}
                    label={t(`ENTER_CONTENT`)}
                    placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
                    isLight={true}
                    readOnly={isHistoryViewer}
                    maxRows={2.125}
                    minRows={2.125}
                  />
                </span>
              </Space>
            </div>
            <div className="m-b-8">
              <span className="subLabel">
                {t(`IMAGE_UPLOAD_LABEL`)}/{t(`IMAGE_DIRECT_INPUT`)}{' '}
              </span>
              <span className="required">*</span>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <FormItem error={errors.view?.items?.[i]?.imageUrl}>
                  <>
                    <Row align="center" gap={12} style={{ margin: 0 }}>
                      <Col span={5} className="itemProfileImg">
                        <ImageFileUploader
                          imageCtrl={IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL}
                          listItemIndex={i}
                          isValid={errors.view?.items?.[i]?.imageUrl ? false : true}
                        />
                      </Col>
                      <Col span={19}>
                        <p>{t(`RECOMMENDED_SIZE`)}</p>
                        <p>400 x 400 </p>
                      </Col>
                    </Row>
                    <ImageInput
                      imageCtrl={IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL}
                      listItemIndex={i}
                      registerName={`view.items.${i}.imageUrl`}
                      placeholder={t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)}
                      isValid={errors.view?.items?.[i]?.imageUrl ? false : true}
                      isSmall={true}
                    />
                  </>
                </FormItem>
              </Space>
            </div>
            {i > 1 && (
              <div className="deleteBtn">
                <Button shape="ghost" onClick={() => handleDeleteListButton(i)}>
                  {t(`DELETE_A_LIST`)}
                </Button>
              </div>
            )}
          </div>
        ))}
        <div>
          {fields.length < 5 ? (
            <Button shape="ghost" className="addBtn" onClick={handleAddListButton}>
              <span>+ {t(`ADD_A_NEW_LIST`)}</span>
            </Button>
          ) : null}
        </div>
      </Collapse>

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

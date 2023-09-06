import { Button, Col, Collapse, Divider, FormItem, Radio, Row, Space } from '@components';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IDataListCardView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { DataListCardItems } from './DataListCardItems';
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

  useEffect(() => {
    if (watch(`view.count`)) {
      setCarouselNum(watch(`view.count`));
    }
  }, [watch(`view.count`)]);

  return (
    <div key={values.id}>
      <Collapse label={t(`VARIABLE_SETTING`)} useSwitch={false}>
        <p className="m-b-12">{t(`DATA_BASIC_CARD_NODE_VARIABLE_INPUT_LABEL`)}</p>
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
        <p className="m-b-12">{t(`DATA_BASIC_CARD_NODE_CAROUSEL_PRINT_OUT`)}</p>
        <div className="dataCarouselPrintOut">
          <Row justify="space-between" className="m-b-12">
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

      <DataListCardItems />

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

      <ConnectNodeBottomEdit nodeId={values.id} />
    </div>
  );
};

import { Button, Col, Collapse, FormItem, Row, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES, ImageAspectRatio } from '@models';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const ListCardNodeEdit = () => {
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
  } = useFormContext<IGNodeEditModel<IListCardView>>();
  const values = getValues();
  console.log('list card node edit value.view', values.view);
  const isHistoryViewer = useHistoryViewerMatch();
  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
    control,
  });

  const handleAddListButton = () => {
    console.log('handle add list btn');
    // e.preventDefault();
    if (fields.length < 5) {
      append(nodeDefaultHelper.createDefaultListCardItem(fields.length));
    } else {
      //modal alert
      console.log('5개까지 가능');
    }
  };

  const handleDeleteListButton = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Collapse label={t(`LIST_NODE_HEAD_TITLE_SETTING`)} useSwitch={false}>
        <FormItem error={errors.view?.header}>
          <InputWithTitleCounter
            label={t(`LIST_NODE_HEAD_TITLE_INPUT`)}
            required={true}
            showCount={true}
            maxLength={40}
            isLight={true}
            {...register('view.header')}
            textLength={watch('view.header')?.length || 0}
            placeholder={t(`LIST_NODE_HEAD_TITLE_INPUT_PLACEHOLDER`)}
            readOnly={isHistoryViewer}
          />
        </FormItem>
      </Collapse>
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
            />
          </FormItem>
        )}
      </Collapse>
      <Collapse label={t(`LIST_SETTING`)} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <div className="m-b-8">
              <span className="subLabel">{t(`IMAGE_UPLOAD_LABEL`)} </span>
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
                      placeholder={t(`IMAGE_INPUT_PLACEHOLDER`)}
                      isValid={errors.view?.items?.[i]?.imageUrl ? false : true}
                    />
                  </>
                </FormItem>
              </Space>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <span className="label">
                  <FormItem error={errors.view?.items?.[i]?.title}>
                    <InputWithTitleCounter
                      label={t(`ENTER_TITLE`)}
                      showCount={true}
                      maxLength={60}
                      required={true}
                      isLight={true}
                      {...register(`view.items.${i}.title`)}
                      textLength={watch(`view.items.${i}.title`)?.length || 0}
                      placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
                      readOnly={isHistoryViewer}
                    />
                  </FormItem>
                </span>
              </Space>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <span className="label">
                  <InputWithTitleCounter
                    label={t(`ENTER_CONTENT`)}
                    showCount
                    maxLength={40}
                    isLight={true}
                    {...register(`view.items.${i}.description`)}
                    textLength={watch(`view.items.${i}.description`)?.length || 0}
                    placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
                    readOnly={isHistoryViewer}
                  />
                </span>
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
      {/* {values.view && values.view.buttons && <ButtonsEdit />} */}
      <Collapse label={t(`BUTTON_SETTING`)} useSwitch={false}>
        {values.view && values.view.buttons && (
          <ButtonsEdit
            imageRatio={watch(`view.imageCtrl.aspectRatio`)}
            nodeId={values.id}
            useCounter={true}
          />
        )}
      </Collapse>
    </>
  );
};

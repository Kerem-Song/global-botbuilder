import { Button, Col, Collapse, Divider, Row, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { IDataListCardView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';

export const DataListCardItems = () => {
  const { t, isReadOnly } = usePage();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IDataListCardView>>();

  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
    control,
  });

  const handleAddListButton = () => {
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
    <Collapse label={t(`LIST_SETTING`)} useSwitch={false}>
      {fields.map((item, i) => (
        <div key={item.id} className="listFieldsWrapper">
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <span className="label">
                <FormItem error={errors.view?.items?.[i]?.title}>
                  <InputTextAreaWithTitleCounter
                    {...register(`view.items.${i}.title`)}
                    label={t(`ENTER_TITLE`)}
                    required={true}
                    placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
                    readOnly={isReadOnly}
                    isLight={true}
                    maxRows={2.125}
                    minRows={2.125}
                  />
                </FormItem>
              </span>
            </Space>
          </div>
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <span className="label">
                <InputTextAreaWithTitleCounter
                  {...register(`view.items.${i}.description`)}
                  label={t(`ENTER_CONTENT`)}
                  placeholder={t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)}
                  isLight={true}
                  readOnly={isReadOnly}
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
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
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
            <Button
              shape="ghost"
              className="deleteBtn"
              onClick={() => handleDeleteListButton(i)}
            >
              {t(`DELETE_A_LIST`)}
            </Button>
          )}
          {fields.length !== i + 1 && <Divider style={{ margin: '32px 0' }} />}
        </div>
      ))}
      <div>
        {fields.length < 5 ? (
          <Button shape="ghost" className="addBtn list" onClick={handleAddListButton}>
            <span>+ {t(`ADD_A_NEW_LIST`)}</span>
          </Button>
        ) : null}
      </div>
    </Collapse>
  );
};

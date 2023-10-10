import { Button, Col, Collapse, Divider, Row, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const ListCardItems = () => {
  const { t, isReadOnly } = usePage();

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardView>>();

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
      {fields.map((item, j) => (
        <div key={item.id} className="listFieldsWrapper">
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <span className="label">
                <FormItem error={errors.view?.items?.[j]?.title}>
                  <InputWithTitleCounter
                    label={t(`ENTER_TITLE`)}
                    showCount={true}
                    maxLength={60}
                    required={true}
                    isLight={true}
                    {...register(`view.items.${j}.title`)}
                    textLength={watch(`view.items.${j}.title`)?.length || 0}
                    placeholder={t(`TITLE_INPUT_PLACEHOLDER`)}
                    readOnly={isReadOnly}
                  />
                </FormItem>
              </span>
            </Space>
          </div>
          <div className="m-b-12">
            <Space direction="vertical" gap={12}>
              <span className="label">
                <InputWithTitleCounter
                  label={t(`ENTER_CONTENT`)}
                  showCount
                  maxLength={40}
                  isLight={true}
                  {...register(`view.items.${j}.description`)}
                  textLength={watch(`view.items.${j}.description`)?.length || 0}
                  placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
                  readOnly={isReadOnly}
                />
              </span>
            </Space>
          </div>
          <div className="m-b-8">
            <span className="subLabel">
              {t(`IMAGE_UPLOAD_LABEL`)}/{t(`IMAGE_DIRECT_INPUT`)}
            </span>
            <span className="required"> *</span>
          </div>
          <div className="m-b-8">
            <Space direction="vertical" gap={12}>
              <FormItem error={errors.view?.items?.[j]?.imageUrl}>
                <>
                  <Row align="center" gap={12} className="itemProfileWrapper">
                    <Col span={5} className="itemProfileImg">
                      <ImageFileUploader
                        imageCtrl={IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL}
                        listItemIndex={j}
                        isValid={errors.view?.items?.[j]?.imageUrl ? false : true}
                      />
                    </Col>
                    <Col span={19}>
                      <p>{t(`RECOMMENDED_SIZE`)}</p>
                      <p>400 x 400 </p>
                    </Col>
                  </Row>
                  <ImageInput
                    imageCtrl={IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL}
                    listItemIndex={j}
                    registerName={`view.items.${j}.imageUrl`}
                    placeholder={t(`IMAGE_INPUT_PLACEHOLDER`)}
                    isValid={errors.view?.items?.[j]?.imageUrl ? false : true}
                    isSmall={true}
                  />
                </>
              </FormItem>
            </Space>
          </div>
          {j > 1 && (
            <Button
              shape="ghost"
              className="deleteBtn"
              onClick={() => handleDeleteListButton(j)}
            >
              {t(`DELETE_A_LIST`)}
            </Button>
          )}
          {fields.length !== j + 1 && <Divider style={{ margin: '32px 0' }} />}
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

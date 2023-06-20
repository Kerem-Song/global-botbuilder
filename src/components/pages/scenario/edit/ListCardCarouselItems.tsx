import { Button, Col, Collapse, Row, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { CTRL_TYPES, IListCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { ID_GEN, ID_TYPES } from '@modules';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ImageFileUploader } from './ImageFileUploader';
import { ImageInput } from './ImageInput';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const ListCardCarouselItems = ({ nestedIndex }: { nestedIndex: number }) => {
  const { t } = usePage();
  const isHistoryViewer = useHistoryViewerMatch();
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardCarouselView>>();

  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews.${nestedIndex}.items`,
    control,
  });

  const handleAddListButton = () => {
    if (fields.length < 5) {
      append({
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.LISTCARD_ITEM_CTRL,
        description: '',
        imageUrl: '',
        imgPath: '',
        title: '',
        seq: 0,
        actionType: '',
        actionValue: '',
        aspectRatio: 0,
      });
    }
  };

  const handleDeleteListButton = (index: number) => {
    remove(index);
  };

  return (
    <Collapse label={t(`LIST_SETTING`)} useSwitch={false}>
      {fields.map((item, j) => (
        <div key={item.id} className="listFieldsWrapper">
          <div className="m-b-8">
            <span className="subLabel">
              {t(`IMAGE_UPLOAD_LABEL`)}/{t(`IMAGE_DIRECT_INPUT`)}
            </span>
            <span className="required"> *</span>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <FormItem
                error={errors.view?.childrenViews?.[nestedIndex]?.items?.[j]?.imageUrl}
              >
                <>
                  <Row align="center" gap={12} style={{ margin: 0 }}>
                    <Col span={5} className="itemProfileImg">
                      <ImageFileUploader
                        imageCtrl={IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL}
                        index={nestedIndex}
                        listItemIndex={j}
                        isValid={
                          errors.view?.childrenViews?.[nestedIndex]?.items?.[j]?.imageUrl
                            ? false
                            : true
                        }
                      />
                    </Col>
                    <Col span={19}>
                      <p>{t(`RECOMMENDED_SIZE`)}</p>
                      <p>400 x 400 </p>
                    </Col>
                  </Row>
                  <ImageInput
                    imageCtrl={IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL}
                    index={nestedIndex}
                    listItemIndex={j}
                    registerName={`view.childrenViews.${nestedIndex}.items.${j}.imageUrl`}
                    placeholder={t(`IMAGE_INPUT_PLACEHOLDER`)}
                    isValid={
                      errors.view?.childrenViews?.[nestedIndex]?.items?.[j]?.imageUrl
                        ? false
                        : true
                    }
                  />
                </>
              </FormItem>
            </Space>
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <span className="label">
                <FormItem
                  error={errors.view?.childrenViews?.[nestedIndex]?.items?.[j]?.title}
                >
                  <InputWithTitleCounter
                    label={t(`ENTER_TITLE`)}
                    showCount={true}
                    maxLength={60}
                    required={true}
                    isLight={true}
                    {...register(`view.childrenViews.${nestedIndex}.items.${j}.title`)}
                    textLength={
                      watch(`view.childrenViews.${nestedIndex}.items.${j}.title`)
                        ?.length || 0
                    }
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
                  {...register(
                    `view.childrenViews.${nestedIndex}.items.${j}.description`,
                  )}
                  textLength={
                    watch(`view.childrenViews.${nestedIndex}.items.${j}.description`)
                      ?.length || 0
                  }
                  placeholder={t(`CONTENT_INPUT_PLACEHOLDER`)}
                  readOnly={isHistoryViewer}
                />
              </span>
            </Space>
          </div>
          {j > 1 && (
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteListButton(j)}>
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
  );
};

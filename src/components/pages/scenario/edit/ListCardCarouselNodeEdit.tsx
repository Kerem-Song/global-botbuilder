import { Button, Col, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { CTRL_TYPES, IListCardCarouselView } from '@models/interfaces/res/IGetFlowRes';
import { ID_GEN, ID_TYPES, NODE_PREFIX } from '@modules';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageSettings } from './ImageSettings';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const ListCardCarouselNodeEdit = () => {
  const { t } = usePage();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardCarouselView>>();
  const values = getValues();
  console.log('list card node edit value.view', values.view);

  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = carouselIndexObj[`${NODE_PREFIX}${values.id}`];

  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews.${index}.items`,
    control,
  });

  const handleAddListButton = () => {
    console.log('handle add list btn');
    // e.preventDefault();
    if (fields.length < 5) {
      append({
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.LISTCARD_ITEM_CTRL,
        description: '',
        imageUrl: '',
        title: '',
        seq: 0,
        actionType: '',
        actionValue: '',
        aspectRatio: 0,
      });
    } else {
      //modal alert
      console.log('5개까지 가능');
    }
  };

  const handleDeleteListButton = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    console.log('list card index', index);
  }, [index]);

  return (
    <>
      {watch(`view.childrenViews.${index}.id`) && (
        <>
          <div className="node-item-wrap">
            <InputWithTitleCounter
              label={t(`LIST_NODE_HEAD_TITLE_SETTING`)}
              required={true}
              showCount={true}
              maxLength={15}
              {...register(`view.childrenViews.${index}.header`)}
              textLength={watch(`view.childrenViews.${index}.header`)?.length || 0}
            />
          </div>

          <Collapse
            label={t(`LIST_NODE_HEAD_IMAGE_SETTING`)}
            useSwitch={true}
            field={`useImageCtrl`}
          >
            {watch(`view.useImageCtrl`) && (
              <ImageSettings
                imageRatio={imageRatio}
                setImageRatio={setImageRatio}
                index={index}
                imageCtrl={IMAGE_CTRL_TYPES.CAROUSEL_IMAGE_CTRL}
              />
            )}
          </Collapse>
          <Collapse label={t(`LIST`)} useSwitch={false}>
            {fields.map((item, i) => (
              <div key={item.id}>
                <div className="m-b-8">
                  <span className="subLabel">{t(`IMAGE_UPLOAD_LABEL`)} </span>
                  <span className="required">*</span>
                </div>
                <div className="m-b-8">
                  <Space direction="vertical">
                    <Row align="center" gap={12} style={{ margin: 0 }}>
                      <Col span={7} className="itemProfileImg">
                        <ImageFileUploader
                          imageCtrl={IMAGE_CTRL_TYPES.LIST_CAROUSEL_ITEM_IMAGE_CTRL}
                          index={index}
                          listItemIndex={i}
                        />
                      </Col>
                      <Col span={15}>
                        <p>{t(`RECOMMENDED_SIZE`)}</p>
                        <p>400 x 400 </p>
                      </Col>
                    </Row>
                  </Space>
                </div>
                <div className="m-b-8">
                  <Space direction="vertical">
                    <span className="label">
                      <InputWithTitleCounter
                        label={t(`TITLE_INPUT`)}
                        showCount={true}
                        maxLength={36}
                        isLight={true}
                        {...register(`view.childrenViews.${index}.items.${i}.title`)}
                        textLength={
                          watch(`view.childrenViews.${index}.items.${i}.title`)?.length ||
                          0
                        }
                      />
                    </span>
                  </Space>
                </div>
                <div className="m-b-8">
                  <Space direction="vertical">
                    <span className="label">
                      <InputWithTitleCounter
                        label={t(`CONTENT_INPUT`)}
                        showCount
                        maxLength={16}
                        isLight={true}
                        {...register(
                          `view.childrenViews.${index}.items.${i}.description`,
                        )}
                        textLength={
                          watch(`view.childrenViews.${index}.items.${i}.description`)
                            ?.length || 0
                        }
                      />
                    </span>
                  </Space>
                </div>
                {i > 1 && (
                  <div className="deleteBtn">
                    <Button shape="ghost" onClick={() => handleDeleteListButton(i)}>
                      {t(`DELETE_BUTTON`)}
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
          <Collapse label={t(`BUTTON`)} useSwitch={false}>
            {values.view && values.view?.childrenViews[index]?.buttons && (
              <ButtonsEdit index={index} isCarousel={true} imageRatio={imageRatio} />
            )}
          </Collapse>
        </>
      )}
    </>
  );
};
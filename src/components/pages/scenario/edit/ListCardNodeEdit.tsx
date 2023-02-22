import { Button, Col, Input, Row, Space } from '@components';
import { Collapse } from '@components/general/Collapse';
import { IGNodeEditModel, IMAGE_CTRL_TYPES } from '@models';
import { ImageAspectRatio } from '@models/enum';
import { CTRL_TYPES, IListCardView } from '@models/interfaces/res/IGetFlowRes';
import { ID_GEN, ID_TYPES } from '@modules';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ImageFileUploader } from './ImageFileUploader';
import { ImageSettings } from './ImageSettings';

export const ListCardNodeEdit = () => {
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IListCardView>>();
  const values = getValues();
  console.log('list card node edit value.view', values.view);

  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
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
      });
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
      <div className="node-item-wrap">
        <div className="m-b-8">
          <span className="label">Head Title </span>
          <span className="required">*</span>
        </div>
        <Input {...register('view.header')} />
      </div>
      <Collapse label={'Head 이미지 설정'} useSwitch={true} field={'imageCtrl'}>
        {values.view?.imageCtrl && (
          <ImageSettings
            imageRatio={imageRatio}
            setImageRatio={setImageRatio}
            imageCtrl={IMAGE_CTRL_TYPES.IMAGE_CTRL}
          />
        )}
      </Collapse>
      <Collapse label={'List'} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <div className="m-b-8">
              <span className="subLabel">List 이미지 업로드 </span>
              <span className="required">*</span>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <Row align="center" gap={12} style={{ margin: 0 }}>
                  <Col span={7} className="itemProfileImg">
                    <ImageFileUploader
                      imageCtrl={IMAGE_CTRL_TYPES.LIST_ITEM_IMAGE_CTRL}
                      listItemIndex={i}
                    />
                  </Col>
                  <Col span={15}>
                    <p>Recommended</p>
                    <p>400 x 400 </p>
                  </Col>
                </Row>
              </Space>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <span className="label">List Title</span>
                <Input {...register(`view.items.${i}.title`)} />
              </Space>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <span className="label">List Contents</span>
                <Input {...register(`view.items.${i}.description`)} />
              </Space>
            </div>
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteListButton(i)}>
                Delete Button
              </Button>
            </div>
          </div>
        ))}
        <div>
          {fields.length < 5 ? (
            <Button shape="ghost" className="addBtn" onClick={handleAddListButton}>
              <span>+ Add a List</span>
            </Button>
          ) : null}
        </div>
      </Collapse>
      {/* {values.view && values.view.buttons && <ButtonsEdit />} */}
      <Collapse label={'버튼'} useSwitch={false}>
        {values.view && values.view.buttons && <ButtonsEdit />}
      </Collapse>
    </>
  );
};

import { icImg } from '@assets';
import {
  Button,
  Col,
  Divider,
  FormItem,
  Input,
  Radio,
  Row,
  Space,
  Switch,
} from '@components';
import { IButtonType, IGNodeEditModel, ISortableListItem } from '@models';
import { ImageAspectRatio } from '@models/enum/ImageAspectRatio';
import {
  ACTION_TYPES,
  ActionTypes,
  IListCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit, selectOptions } from './ButtonsEdit';
import { ButtonTypeSelector } from './ButtonTypeSelector';
import { ImageSetting } from './ImageSetting';
import { SelectScenario } from './SelectScenario';

export const ListCardNodeEdit = () => {
  const [buttonType, setButtonType] = useState<ActionTypes>();
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

  const {
    fields: buttonFields,
    append: buttonAppend,
    remove: buttonRemove,
  } = useFieldArray({
    name: `view.buttons`,
    control,
  });
  const handleAddListButton = () => {
    console.log('handle add list btn');
    // e.preventDefault();
    if (fields.length < 5) {
      append({
        id: '',
        typeName: '',
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

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (buttonFields.length < 3) {
      buttonAppend({
        id: '',
        typeName: '',
        label: '',
        seq: 0,
        actionType: '',
        actionValue: '',
      });
    } else {
      //modal alert
      console.log('3개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    buttonRemove(index);
  };

  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <span className="label">Head Title</span>
            <Input {...register('view.header')} value={values.view?.header || ''} />
          </Space>
        </div>
      </div>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">Head 이미지 설정</span>
            <Switch {...register('view.imageCtrl')} />
          </Space>
        </div>
        {values.view?.imageCtrl && (
          <ImageSetting imageRatio={imageRatio} setImageRatio={setImageRatio} />
        )}
      </div>
      <div className="node-item-wrap">
        <Space style={{ alignItems: 'center' }}>
          <span className="label">List</span>
        </Space>
        <Divider />
        {fields.map((item, i) => (
          <div key={item.id}>
            <div className="m-b-8">
              <span className="subLabel">List 이미지 업로드 </span>
              <span className="required">*</span>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <Row align="center" gap={12} style={{ margin: 0 }}>
                  <Col span={7} className="img"></Col>
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
                <Input {...register(`view.items.${i}.title`)} value={item.title || ''} />
              </Space>
            </div>
            <div className="m-b-8">
              <Space direction="vertical">
                <span className="label">List Contents</span>
                <Input
                  {...register(`view.items.${i}.description`)}
                  value={item.description || ''}
                />
              </Space>
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
      </div>
      {values.view && values.view.buttons && <ButtonsEdit />}
    </>
  );
};

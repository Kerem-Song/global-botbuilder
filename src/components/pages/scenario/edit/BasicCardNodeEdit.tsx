import { icImg } from '@assets';
import {
  Button,
  Col,
  Divider,
  FormItem,
  Input,
  InputTextarea,
  Radio,
  Row,
  Space,
  Switch,
} from '@components';
import { IGNodeEditModel } from '@models';
import { ImageAspectRatio } from '@models/enum/ImageAspectRatio';
import {
  ACTION_TYPES,
  ActionTypes,
  IBasicCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonsEdit } from './ButtonsEdit';
import { ButtonTypeSelector } from './ButtonTypeSelector';
import { ImageSetting } from './ImageSetting';
import { SelectScenario } from './SelectScenario';

const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: 'Node Redirect' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: 'Action is Utterance' },
  { value: ACTION_TYPES.LBL_IS_UTTR, label: 'Label is Utterance' },
  { value: ACTION_TYPES.URL, label: 'Url 연결' },
];

export const BasicCardNodeEdit = () => {
  const [buttonType, setButtonType] = useState<ActionTypes>();
  const [imageRatio, setImageRatio] = useState<ImageAspectRatio>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IBasicCardView>>();
  const values = getValues();
  console.log('basic card node edit', values);

  const { fields, append, remove } = useFieldArray({
    name: `view.buttons`,
    control,
  });

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 3) {
      append({
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
    remove(index);
  };

  useEffect(() => {
    console.log('basic card node edit');
  }, [fields]);
  return (
    <>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">이미지 설정</span>
            <Switch {...register('view.imageCtrl')} />
          </Space>
        </p>
        {values.view?.imageCtrl && (
          <ImageSetting imageRatio={imageRatio} setImageRatio={setImageRatio} />
        )}
      </div>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <span className="label">텍스트 설정 </span>
          <span className="required">*</span>
        </p>
        <Divider />
        <Space direction="vertical">
          <span className="subLabel">타이틀</span>
          <FormItem error={errors.view && errors.view.title}>
            <Input {...register('view.title')} />
          </FormItem>
          <span className="subLabel">내용</span>
          <FormItem error={errors.view && errors.view.description}>
            <InputTextarea
              height={100}
              showCount
              maxLength={1000}
              placeholder="Input Text"
              {...register('view.description')}
            />
          </FormItem>
        </Space>
      </div>
      {values.view && values.view.buttons && <ButtonsEdit />}
    </>
  );
};

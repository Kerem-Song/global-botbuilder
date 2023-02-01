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
import {
  ACTION_TYPES,
  ActionTypes,
  IBasicCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonTypeSelector } from './ButtonTypeSelector';
import { SelectScenario } from './SelectScenario';

const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: 'Node Redirect' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: 'Action is Utterance' },
  { value: ACTION_TYPES.LBL_IS_UTTR, label: 'Label is Utterance' },
  { value: ACTION_TYPES.URL, label: 'Url 연결' },
];

export const BasicCardNodeEdit = () => {
  const [buttonType, setButtonType] = useState<ActionTypes>();
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

  const handleAddConditionButton = () => {
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
            <Switch />
          </Space>
        </p>
        <Space direction="vertical">
          <span className="subLabel">이미지 업로드</span>
          <span className="subLabel">이미지 타입</span>
          <Row>
            <Col span={12}>
              <Radio>
                <span>직사각형</span>
              </Radio>
            </Col>
            <Col span={12}>
              <Radio>
                <span>정사각형</span>
              </Radio>
            </Col>
          </Row>
          <div
            style={{
              height: '118px',
              border: '1px dashed #DCDCDC',
              background: '#FFFFFF',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                textAlign: 'center',
                width: '200px',
                bottom: '50%',
                right: '50%',
                transform: 'translate(50%, 50%)',
              }}
            >
              <img src={icImg} alt="icImg" />
              <br />
              Recommended
              <br />
              Rectangular: 800x400
            </div>
          </div>
        </Space>
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
      <div className="node-item-wrap">
        <p className="m-b-8">
          <span className="label">버튼</span>
          <span className="required">*</span>
        </p>
        <Divider />
        {fields.map((item, i) => (
          <Space direction="vertical" key={item.id}>
            <Space direction="vertical">
              <span className="subLabel">버튼명</span>
              <FormItem
                error={
                  errors.view && errors.view.buttons && errors.view.buttons[i]?.label
                }
              >
                <Input {...register(`view.buttons.${i}.label`)} />
              </FormItem>
              <span className="subLabel">버튼타입</span>
              <ButtonTypeSelector
                index={i}
                options={selectOptions}
                setButtonType={setButtonType}
              />
              {values.view &&
                values.view?.buttons &&
                values.view?.buttons[i]?.actionType ===
                  ACTION_TYPES.LUNA_NODE_REDIRECT && (
                  <SelectScenario fieldName={ACTION_TYPES.LUNA_NODE_REDIRECT} />
                )}
              {values.view &&
                values.view?.buttons &&
                values.view?.buttons[i]?.actionType === ACTION_TYPES.URL && (
                  <FormItem
                    error={
                      errors.view &&
                      errors.view.buttons &&
                      errors.view.buttons[i]?.actionValue
                    }
                  >
                    <Input {...register(`view.buttons.${i}.actionValue`)} />
                  </FormItem>
                )}
              <div className="deleteBtn">
                <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                  Delete Button
                </Button>
              </div>
            </Space>
          </Space>
        ))}
        {fields.length < 3 && (
          <Button shape="ghost" className="addBtn" onClick={handleAddConditionButton}>
            <span>+ Add a Button</span>
          </Button>
        )}
      </div>
    </>
  );
};

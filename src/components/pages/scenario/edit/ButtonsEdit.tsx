import { Button, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { IGNodeEditModel } from '@models';
import {
  ACTION_TYPES,
  ActionTypes,
  IHasButtonViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonTypeSelector } from './ButtonTypeSelector';
import { SelectNode } from './SelectNode';

export const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: 'Node Redirect' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: 'Action is Utterance' },
  { value: ACTION_TYPES.LBL_IS_UTTR, label: 'Label is Utterance' },
  { value: ACTION_TYPES.URL, label: 'Url 연결' },
];

export const ButtonsEdit = () => {
  const [buttonType, setButtonType] = useState<ActionTypes>();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IHasButtonViewBase>>();

  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: 'view.buttons',
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

  return (
    <>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            <span className="subLabel">버튼명</span>
            <FormItem
              error={errors.view && errors.view.buttons && errors.view.buttons[i]?.label}
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
              values.view?.buttons[i]?.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && (
                <SelectNode fieldName={`buttons.${i}.actionValue`} />
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
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>+ Add a Button</span>
        </Button>
      )}
    </>
  );
};

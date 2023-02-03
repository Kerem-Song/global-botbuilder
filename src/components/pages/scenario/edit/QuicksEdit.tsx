import { Button, Divider, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { IGNodeEditModel } from '@models';
import { ACTION_TYPES, IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { nodeHelper } from '../../../../modules/nodeHelper';
import { ButtonCtrlSelector } from './ButtonCtrlSelector';
import { SelectNode } from './SelectNode';

export const QuicksEdit = () => {
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();

  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: 'view.quicks',
    control,
  });

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 10) {
      append(nodeHelper.createDefaultAnswerQickItem(fields.length));
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  return (
    <div className="node-item-wrap">
      <p className="m-b-8">
        <span className="label">퀵 리플라이 버튼 설정</span>
      </p>
      <Divider />
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            <span className="subLabel">버튼명</span>
            <FormItem
              error={errors.view && errors.view.quicks && errors.view.quicks[i]?.label}
            >
              <Input {...register(`view.quicks.${i}.label`)} />
            </FormItem>
            <span className="subLabel">버튼타입</span>
            <ButtonCtrlSelector name={`view.quicks.${i}.actionType`} />
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.LUNA_NODE_REDIRECT && (
              <SelectNode
                fieldName={`quicks.${i}.actionValue`}
                defaultValue={values.view?.quicks?.[i].actionValue}
              />
            )}
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.URL && (
              <FormItem
                error={
                  errors.view && errors.view.quicks && errors.view.quicks[i]?.actionValue
                }
              >
                <Input {...register(`view.quicks.${i}.actionValue`)} />
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
    </div>
  );
};

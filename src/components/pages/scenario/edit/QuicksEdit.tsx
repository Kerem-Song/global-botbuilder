import { Button, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ACTION_TYPES, IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonCtrlSelector } from './ButtonCtrlSelector';
import { SelectNode } from './SelectNode';

export const QuicksEdit = () => {
  const { t } = usePage();
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
      append(nodeDefaultHelper.createDefaultAnswerQickItem(fields.length));
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  return (
    <Collapse label={t(`QUICK_REPLY_BUTTON_SETTING`)} useSwitch={false}>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            <FormItem
              error={errors.view && errors.view.quicks && errors.view.quicks[i]?.label}
            >
              <Input
                hasTitle={true}
                label={t(`BUTTON_NAME`)}
                required={true}
                showCount={true}
                maxLength={14}
                isLight={true}
                {...register(`view.quicks.${i}.label`)}
              />
            </FormItem>
            <span className="subLabel">{t(`BUTTON_TYPE`)}</span>
            <ButtonCtrlSelector name={`view.quicks.${i}.actionType`} />
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.LUNA_NODE_REDIRECT && (
              <SelectNode
                fieldName={`view.quicks.${i}.actionValue`}
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
                {t(`DELETE_BUTTON`)}
              </Button>
            </div>
          </Space>
        </Space>
      ))}
      {fields.length < 3 && (
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>+ {t(`ADD_A_QUICK_REPLY`)}</span>
        </Button>
      )}
    </Collapse>
  );
};

import { Button, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import {
  ACTION_TYPES,
  ActionTypes,
  IHasButtonCarouselViewBase,
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

export const CarouselButtonsEdit = ({ index }: { index: number }) => {
  const { t } = usePage();
  const [buttonType, setButtonType] = useState<ActionTypes>();
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IHasButtonCarouselViewBase>>();

  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews.${index}.buttons`,
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

  console.log('errors in caro btn edit', errors);
  return (
    <>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            <span className="subLabel">버튼명</span>
            <FormItem error={errors.view?.childrenViews?.[index]?.buttons?.[i]?.label}>
              <Input {...register(`view.childrenViews.${index}.buttons.${i}.label`)} />
            </FormItem>
            <span className="subLabel">버튼타입</span>
            <ButtonTypeSelector
              index={i}
              options={selectOptions}
              setButtonType={setButtonType}
              isCarousel={true}
              carouselIndex={index}
            />
            {watch(`view.childrenViews.${index}.buttons.${i}.actionType`) ===
              ACTION_TYPES.LUNA_NODE_REDIRECT && (
              <SelectNode fieldName={`childrenViews.${index}.buttons.${i}.actionValue`} />
            )}
            {watch(`view.childrenViews.${index}.buttons.${i}.actionType`) ===
              ACTION_TYPES.URL && (
              <FormItem
                error={errors.view?.childrenViews?.[index]?.buttons?.[i]?.actionValue}
              >
                <Input
                  {...register(`view.childrenViews.${index}.buttons.${i}.actionValue`)}
                />
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
          <span>{t(`ADD_A_NEW_SCENARIO_BTN`)}</span>
        </Button>
      )}
    </>
  );
};

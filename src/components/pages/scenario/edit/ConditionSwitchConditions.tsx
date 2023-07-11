import { FormItem, Space } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { ConditionOperator, IGNodeEditModel } from '@models';
import { IConditionView, ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { VariableSelector } from './VariableSelector';

export const ConditionSwitchConditions = ({ nestedIndex }: { nestedIndex: number }) => {
  const CONDITION_LIMIT = 13;
  const { t } = usePage();
  const isHistoryViewer = useHistoryViewerMatch();
  const {
    getValues,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();
  const values = getValues();

  const { field: joinField } = useController({
    name: `view.conditions.${nestedIndex}.join`,
    control,
  });

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions.${nestedIndex}.items`,
    control,
  });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    console.log('handle add condition btn');
    e.preventDefault();
    if (fields.length < 5) {
      append({
        op1: '',
        operator: ConditionOperator.Is,
        op2: '',
      });
    } else {
      //modal alert
      console.log('5개까지 가능');
    }
  };

  return (
    <>
      {fields.map((item, i) => (
        <div key={item.id}>
          <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op1}>
            <VariableSelector
              placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
              control={control}
              path={`view.conditions.${nestedIndex}.items.${i}.op1`}
            />
          </FormItem>

          <OperatorSelector index={i} nestedIndex={nestedIndex} />
          <p className="error-message">
            {errors.view?.conditions?.[nestedIndex]?.items?.[i]?.operator?.message}
          </p>
          <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op2}>
            <VariableSelector
              placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
              control={control}
              path={`view.conditions.${nestedIndex}.items.${i}.op2`}
            />
          </FormItem>
        </div>
      ))}
    </>
  );
};

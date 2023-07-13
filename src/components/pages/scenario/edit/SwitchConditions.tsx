import { FormItem } from '@components';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { VariableSelector } from './VariableSelector';

export const SwitchConditions = ({ nestedIndex }: { nestedIndex: number }) => {
  const { t } = usePage();
  const isHistoryViewer = useHistoryViewerMatch();
  const {
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();

  const { fields } = useFieldArray({
    name: `view.conditions.${nestedIndex}.items`,
    control,
  });

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

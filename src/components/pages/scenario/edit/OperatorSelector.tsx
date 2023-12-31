import { useI18n, usePage } from '@hooks';
import { ConditionOperator, ConditionOperatorKeys } from '@models';
import { getReactSelectStyle, onMenuOpenScroller } from '@modules';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export const OperatorSelector = ({
  index,
  nestedIndex,
}: {
  index: number;
  nestedIndex?: number;
}) => {
  const { getConditionOperatorLabel } = useI18n();
  const { t } = usePage();
  const operatorOptions = [
    { value: 0, label: t(`CONDITION_NODE_SET_OPERATOR`) },
    ...Object.keys(ConditionOperator)
      .filter((o) => isNaN(Number(o)))
      .map((o) => {
        return {
          value: ConditionOperator[o as ConditionOperatorKeys],
          label: getConditionOperatorLabel(
            false,
            ConditionOperator[o as ConditionOperatorKeys],
          ),
        };
      }),
  ];

  const { control } = useFormContext();
  const { field: operatorField } = useController({
    name:
      nestedIndex !== undefined
        ? `view.childrenViews.${nestedIndex}.items.${index}.operator`
        : `view.items.${index}.operator`,
    control,
  });
  const reactSelectStyle = getReactSelectStyle({});

  return (
    <Select
      className="react-selector"
      {...operatorField}
      options={operatorOptions}
      placeholder={t(`INPUT_VARIABLE_SECOND_CONDITION_PLACEHOLDER`)}
      styles={reactSelectStyle}
      value={operatorOptions.find((item) => item.value === operatorField.value)}
      onChange={(options: any) => operatorField.onChange(options?.value)}
      onMenuOpen={onMenuOpenScroller}
    />
  );
};

import { useI18n } from '@hooks';
import { ConditionOperator, ConditionOperatorKeys } from '@models';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

const reactSelectStyle: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '100%',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '40px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
    paddingRight: '10px',
  }),
  indicatorsContainer: () => ({}),
  valueContainer: (provided) => ({
    ...provided,
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: '#000',
  }),
  input: (provided) => ({
    ...provided,
    color: 'transparent',
    textShadow: '0 0 0 black',
  }),
  option: (provided) => ({
    ...provided,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',

    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 400,
    color: '#757575',
    lineHeight: 1.5,
    backgroundColor: 'white',
    ':hover': {
      color: '#222222',
      backgroundColor: '#ECF2FF',
      borderRadius: '6px',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: '#222222',
    overflow: 'unset',
    textOverflow: 'unset',
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px solid #DCDCDC',
    borderRadius: '8px',
  }),
};

export const OperatorSelector = ({ index }: { index: number }) => {
  const { getConditionOperatorLabel } = useI18n();
  const operatorOptions = [
    { value: 0, label: '조건을 선택해주세요.' },
    ...Object.keys(ConditionOperator)
      .filter((o) => isNaN(Number(o)))
      .map((o) => {
        return {
          value: ConditionOperator[o as ConditionOperatorKeys],
          label: getConditionOperatorLabel(ConditionOperator[o as ConditionOperatorKeys]),
        };
      }),
  ];

  const { control } = useFormContext();
  const { field: operatorField } = useController({
    name: `view.items.${index}.operator`,
    control,
  });

  return (
    <Select
      className="react-selector"
      {...operatorField}
      options={operatorOptions}
      styles={reactSelectStyle}
      value={operatorOptions.find((item) => item.value === operatorField.value)}
      onChange={(options: any) => operatorField.onChange(options?.value)}
    />
  );
};

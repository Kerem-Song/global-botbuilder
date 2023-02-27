import { ConditionOperator } from '@models';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

const operatorOptions = [
  { value: ConditionOperator.Is, label: 'is/are equal to' },
  { value: ConditionOperator.IsNot, label: 'is/are not equal to' },
  { value: ConditionOperator.Contain, label: 'contain(s)' },
  { value: ConditionOperator.NotContain, label: 'not contain' },
  { value: ConditionOperator.GreaterThan, label: 'is/are greater than' },
  { value: ConditionOperator.LessThan, label: 'is/are lesser than' },
  { value: ConditionOperator.StartWith, label: 'start with' },
  { value: ConditionOperator.EndWith, label: 'end with' },
  { value: ConditionOperator.Regex, label: 'regex' },
];

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
    minHeight: '34px',
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
  const { control } = useFormContext();
  const { field: operatorField } = useController({
    name: `view.items.${index}.operator`,
    control,
  });

  return (
    <Select
      {...operatorField}
      options={operatorOptions}
      styles={reactSelectStyle}
      value={operatorOptions.find((item) => item.value === operatorField.value)}
      onChange={(options: any) => operatorField.onChange(options?.value)}
    />
  );
};

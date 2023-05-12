import { ACTION_TYPES } from '@models/interfaces/res/IGetFlowRes';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

export const reactSelectStyle: StylesConfig = {
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
    marginRight: '10px',
  }),
  indicatorsContainer: () => ({}),
  valueContainer: (provided) => ({
    ...provided,
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: '#dcdcdc',
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
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

interface IButtonCtrlSelectorProp {
  name: string;
  value: string;
}

export const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: '메시지 연결' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: '메시지 입력' },
  { value: ACTION_TYPES.LBL_IS_UTTR, label: '버튼명 입력' },
  { value: ACTION_TYPES.URL, label: 'URL 연결' },
];

export const ButtonCtrlSelector = ({ name, value }: IButtonCtrlSelectorProp) => {
  const { setValue, control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  return (
    <Select
      className="react-selector"
      {...field}
      options={selectOptions}
      styles={reactSelectStyle}
      value={selectOptions.find((item) => item.value === field.value)}
      onChange={(options: any) => {
        field.onChange(options?.value);
        setValue(value, '');
      }}
    />
  );
};

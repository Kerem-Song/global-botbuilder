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
    width: '220px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '34px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
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

interface IReactSelect {
  value: string;
  label: string;
}

export const ButtonTypeSelector = ({
  index,
  options,
}: {
  index: number;
  options: IReactSelect[];
}) => {
  const { control } = useFormContext();
  const { field } = useController({
    name: `view.buttons.${index}.actionType`,
    control,
  });

  return (
    <Select
      {...field}
      options={options}
      styles={reactSelectStyle}
      value={options.find((item) => item.value === field.value)}
      onChange={(options: any) => field.onChange(options?.value)}
    />
  );
};

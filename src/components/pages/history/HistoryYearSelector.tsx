import { usePage, useRootState } from '@hooks';
import { IHistoryCondition } from '@models/interfaces/IHistory';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

interface IReactSelect {
  value: string | null;
  label: string;
}

const reactSelectStyle: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '120px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '34px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
    paddingTop: '5px',
    paddingRight: '5px',
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

export const HistoryYearSelector = () => {
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IHistoryCondition>();

  const { field: yearField } = useController({
    name: `year`,
    control,
  });

  const yearOptions = useRootState(
    (state) => state.historyInfoReducer.historyYearSelector,
  );

  return (
    <Select
      options={yearOptions}
      styles={reactSelectStyle}
      defaultValue={{ value: null, label: 'All' }}
      value={yearOptions.find((item) => item.value === yearField.value)}
      onChange={(options: any) => yearField.onChange(options?.value)}
    />
  );
};

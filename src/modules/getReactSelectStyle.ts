import { StylesConfig } from 'react-select';

export const getReactSelectStyle = <T>({
  hideIndicator,
  width,
}: {
  hideIndicator?: boolean;
  width?: number;
}) => {
  const reactSelectStyle: StylesConfig<T, false> = {
    control: (provided, state) => ({
      ...provided,
      alignItems: 'center',
      borderRadius: '8px',
      border: '1px solid #DCDCDC',
      borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
      fontSize: '13px',
      width: width ? `${width}px` : '100%',
      ':hover': {
        borderColor: '#e7e7e7',
      },
      minHeight: '40px',
    }),
    clearIndicator: () => ({
      display: hideIndicator ? 'none' : 'block',
    }),
    dropdownIndicator: () => ({
      color: '#B5B4B4',
      paddingTop: '5px',
      paddingRight: '5px',
      //display: hideIndicator ? 'none' : 'block',
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
      color: '#000',
      // color: 'transparent',
      textShadow: '0 0 0 black',
    }),
    option: (provided, state) => ({
      ...provided,
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',

      padding: '10px 8px',
      fontSize: '13px',
      fontWeight: state.isSelected ? 700 : 400,
      color: state.isSelected ? '#222222' : '#757575',
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
      padding: '4px 8px',
      border: '1px solid #DCDCDC',
      borderRadius: '8px',
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return reactSelectStyle;
};

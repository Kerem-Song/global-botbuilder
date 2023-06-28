import { getReactSelectStyle } from '@modules';
import { Dispatch, SetStateAction } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';
interface IReactSelect {
  value: string;
  label: string;
}

interface IButtonTypeSelector {
  index: number;
  options: IReactSelect[];
  setButtonType: Dispatch<SetStateAction<string | undefined>>;
  isCarousel?: boolean;
  carouselIndex?: number;
}

export const ButtonTypeSelector = ({
  index,
  options,
  setButtonType,
  isCarousel,
  carouselIndex,
}: IButtonTypeSelector) => {
  const { control, setValue } = useFormContext();
  const reactSelectStyle = getReactSelectStyle({});
  const { field } = useController({
    name: isCarousel
      ? `view.childrenViews.${carouselIndex}.buttons.${index}.actionType`
      : `view.buttons.${index}.actionType`,
    control,
  });

  return (
    <Select
      className="react-selector"
      {...field}
      options={options}
      styles={reactSelectStyle}
      value={options.find((item) => item.value === field.value)}
      onChange={(options: any) => {
        field.onChange(options?.value);
        setButtonType(options.value);
        setValue(
          isCarousel
            ? `view.childrenViews.${carouselIndex}.buttons.${index}.actionValue`
            : `view.buttons.${index}.actionValue`,
          '',
          { shouldDirty: true },
        );
      }}
      minMenuHeight={500}
    />
  );
};

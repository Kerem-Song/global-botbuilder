import { FormItem, Input, InputTextarea } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

export const TextNodeEdit = () => {
  const { t } = usePage();
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ITextView>>();
  console.log(getValues());
  return (
    <>
      <div className="node-item-wrap">
        <FormItem error={errors.view && errors.view?.text}>
          <InputTextarea
            label={t(`TEXT`)}
            hasTitle={false}
            required={true}
            style={{ minHeight: '100px', maxHeight: '320px' }}
            autoHeight
            showCount
            maxLength={1000}
            placeholder="Input Text"
            {...register('view.text')}
          />
        </FormItem>
      </div>
    </>
  );
};

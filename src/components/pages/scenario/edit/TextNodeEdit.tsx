import { FormItem, Input, InputTextarea } from '@components';
import { IGNodeEditModel } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

export const TextNodeEdit = () => {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ITextView>>();
  console.log(getValues());
  return (
    <>
      <div className="node-item-wrap">
        <p className="m-b-8">
          <span className="label">텍스트</span>
          <span className="required">*</span>
        </p>
        <FormItem error={errors.view && errors.view?.text}>
          <InputTextarea
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

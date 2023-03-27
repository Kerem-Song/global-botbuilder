import { FormItem, InputTextarea } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';

export const TextNodeEdit = () => {
  const { t } = usePage();
  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ITextView>>();

  console.log(getValues());
  return (
    <>
      <div className="node-item-wrap">
        <FormItem error={errors.view && errors.view?.text}>
          <InputTextAreaWithTitleCounter
            className="textNodeTextArea"
            maxRows={17}
            label={t(`TEXT`)}
            required={true}
            showCount
            maxLength={1000}
            placeholder="Input Text"
            {...register('view.text')}
            textLength={watch(`view.text`)?.length || 0}
          />
        </FormItem>
      </div>
    </>
  );
};

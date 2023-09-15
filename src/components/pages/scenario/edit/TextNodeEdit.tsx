import { FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';

export const TextNodeEdit = () => {
  useNodeEditSave();

  const { t, isReadOnly } = usePage();

  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ITextView>>();

  const values = getValues();

  return (
    <>
      <div className="node-item-wrap">
        <FormItem error={errors.view && errors.view?.text}>
          <InputTextAreaWithTitleCounter
            className={classNames('textNodeTextArea', { invalid: errors.view?.text })}
            maxRows={18}
            label={t(`TEXT`)}
            required={true}
            showCount
            maxLength={1000}
            placeholder={t(`TEXT_INPUT_PLACEHOLDER`)}
            {...register('view.text')}
            textLength={watch(`view.text`)?.length || 0}
            readOnly={isReadOnly}
          />
        </FormItem>
      </div>
      <ConnectNodeBottomEdit nodeId={values.id} />
    </>
  );
};

export default TextNodeEdit;

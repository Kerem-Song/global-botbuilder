import { FormItem } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { ConnectNodeBottomEdit } from './ConnectNodeBottomEdit';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';

export const TextNodeEdit = () => {
  useNodeEditSave();

  const { t } = usePage();

  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ITextView>>();
  const isHistoryViewer = useHistoryViewerMatch();
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
            placeholder="Input Text"
            {...register('view.text')}
            textLength={watch(`view.text`)?.length || 0}
            readOnly={isHistoryViewer}
          />
        </FormItem>
      </div>
      <ConnectNodeBottomEdit nodeId={values.id} />
    </>
  );
};

export default TextNodeEdit;

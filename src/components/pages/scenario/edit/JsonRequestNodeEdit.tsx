import { FormItem } from '@components/data-entry';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';

export const JsonRequestNodeEdit = () => {
  useNodeEditSave();

  const { t } = usePage();

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IJsonRequestView>>();

  const isHistoryViewer = useHistoryViewerMatch();

  return (
    <>
      <div className="node-item-wrap">
        <FormItem>
          <InputTextAreaWithTitleCounter
            className="textNodeTextArea"
            maxRows={17}
            label={t(`TEXT`)}
            required={true}
            showCount
            placeholder="Input Text"
            {...register('view.body')}
            readOnly={isHistoryViewer}
          />
        </FormItem>
      </div>
    </>
  );
};

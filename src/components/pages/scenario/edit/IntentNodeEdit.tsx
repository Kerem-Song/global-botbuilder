import { Collapse, FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IIntentView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

import { SelectNode } from './SelectNode';

export const IntentNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const {
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IIntentView>>();

  return (
    <>
      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-12">
          <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
          <span className="required">*</span>
        </div>

        <FormItem error={errors.nextNodeId}>
          <SelectNode fieldName={'nextNodeId'} nodeId={getValues().id} />
        </FormItem>
      </Collapse>
    </>
  );
};

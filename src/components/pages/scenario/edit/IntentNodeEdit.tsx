import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useNodeEditSave } from '@hooks/useNodeEditSave';
import { IGNodeEditModel } from '@models';
import { IIntentView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

import { SelectNode } from './SelectNode';

export const IntentNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const { getValues } = useFormContext<IGNodeEditModel<IIntentView>>();
  return (
    <>
      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
          <span className="required">*</span>
        </div>

        <SelectNode fieldName={'nextNodeId'} nodeId={getValues().id} />
      </Collapse>
    </>
  );
};

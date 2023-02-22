import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';

import { SelectNode } from './SelectNode';

export const IntentNodeEdit = () => {
  const { t } = usePage();

  return (
    <>
      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
          <span className="required">*</span>
        </div>

        <SelectNode fieldName={'nextNodeId'} />
      </Collapse>
    </>
  );
};

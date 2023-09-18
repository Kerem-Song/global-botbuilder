import { Collapse, FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { useFormContext } from 'react-hook-form';

import { ParameterSetNodeField } from './ParameterSetNodeField';
import { SelectNode } from './SelectNode';

export const ParameterSetNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const {
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();

  const values = getValues();

  return (
    <div key={values.id}>
      <ParameterSetNodeField />

      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
        </div>
        <FormItem error={errors.nextNodeId}>
          <SelectNode
            fieldName={'nextNodeId'}
            nodeId={getValues().id}
            error={errors.nextNodeId}
          />
        </FormItem>
      </Collapse>
    </div>
  );
};

import { Collapse, FormItem } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { SelectNode } from './SelectNode';

export const ConnectNodeBottomEdit = React.memo(({ nodeId }: { nodeId?: string }) => {
  const { t } = usePage();
  const {
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IViewBase>>();

  return (
    <Collapse label={t(`SET_CONNECT_NODE_BOTTOM`)} useSwitch={false}>
      <div className="m-b-8">
        <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)}</span>
      </div>
      <FormItem error={errors.nextNodeId}>
        <SelectNode
          fieldName={`nextNodeId`}
          nodeId={nodeId}
          error={errors.nextNodeId}
          isBottom
        />
      </FormItem>
    </Collapse>
  );
});

ConnectNodeBottomEdit.displayName = 'ConnectNodeBottomEdit';

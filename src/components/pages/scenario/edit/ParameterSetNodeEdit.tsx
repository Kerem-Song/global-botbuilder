import { Button, Collapse, Divider, FormItem } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ParameterSelector } from './ParameterSelector';
import { SelectNode } from './SelectNode';
import { VariableSelector } from './VariableSelector';

export const ParameterSetNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();
  const isHistoryViewer = useHistoryViewerMatch();
  const { fields, append, remove } = useFieldArray({
    name: 'view.parameters',
    control,
  });
  console.log('get value param', getValues());

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 10) {
      append(nodeDefaultHelper.createDefaultParameterSetParams());
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Collapse label={t(`PARAMETER_SET_LABEL`)} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <div className="m-b-8">
              <span className="subLabel">{t(`PARAMETER_SET_VARIABLE`)} </span>
              <span className="required">*</span>
            </div>
            <FormItem
              error={
                errors.view && errors.view.parameters && errors.view.parameters[i]?.name
              }
            >
              <ParameterSelector
                control={control}
                path={`view.parameters.${i}.name`}
                placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
                readOnly={isHistoryViewer}
              />
            </FormItem>

            <div className="m-b-8">
              <span className="subLabel">{t(`PARAMETER_SET_VALUE_TO_STORE`)} </span>
              <span className="required">*</span>
            </div>
            <FormItem
              error={
                errors.view && errors.view.parameters && errors.view.parameters[i]?.value
              }
            >
              <VariableSelector
                placeholder={t(`PARAMETER_SET_VALUE_TO_STORE_PLACEHOLDER`)}
                control={control}
                path={`view.parameters.${i}.value`}
                readOnly={isHistoryViewer}
              />
            </FormItem>
            {i > 0 && (
              <div className="deleteBtn">
                <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                  {t(`PARAMETER_SET_DELETE_BUTTON`)}
                </Button>
              </div>
            )}
            <Divider style={{ margin: '32px 0' }} />
          </div>
        ))}

        {fields.length < 10 && (
          <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
            <span>+ {t(`PARAMETER_SET_ADD_BUTTON`)}</span>
          </Button>
        )}
      </Collapse>

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
    </>
  );
};

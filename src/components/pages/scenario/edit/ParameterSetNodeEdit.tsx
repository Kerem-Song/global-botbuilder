import { FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Collapse } from '@components/general/Collapse';
import { usePage, useRootState } from '@hooks';
import { IGNodeEditModel, IReactSelect } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { nodeHelper } from '@modules/nodeHelper';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonCtrlSelector';
import { SelectNode } from './SelectNode';

export const ParameterSetNodeEdit = () => {
  const { t } = usePage();
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();

  const values = getValues();

  const { fields, append, remove } = useFieldArray({
    name: 'view.parameters',
    control,
  });

  const { field: nextNodeId } = useController({
    name: 'nextNodeId',
    control,
  });

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 10) {
      append(nodeHelper.createDefaultParameterSetParams());
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  console.log('value.view in ParameterSetNodeNodeEdit', values);
  console.log('errors in Parameter set node edit:', errors);
  console.log('next node id field', nextNodeId);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const scenarios: IReactSelect[] = nodes.map((item) => ({
    value: item.id,
    label: item.title || '',
  }));

  return (
    <>
      <Collapse label={t(`PARAMETER_SET_LABEL`)} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={i}>
            <div className="m-b-8">
              <span className="subLabel">{t(`PARAMETER_SET_VARIABLE`)} </span>
              <span className="required">*</span>
            </div>
            <FormItem
              error={
                errors.view && errors.view.parameters && errors.view.parameters[i]?.name
              }
            >
              <Input
                {...register(`view.parameters.${i}.name`)}
                placeholder={t(`PARAMETER_SET_VARIABLE_PLACEHOLDER`)}
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
              <Input
                {...register(`view.parameters.${i}.value`)}
                placeholder={t(`PARAMETER_SET_VALUE_TO_STORE_PLACEHOLDER`)}
              />
            </FormItem>
            {i > 0 && (
              <div className="deleteBtn">
                <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                  {t(`PARAMETER_SET_DELETE_BUTTON`)}
                </Button>
              </div>
            )}
          </div>
        ))}

        {fields.length < 10 && (
          <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
            <span>+ {t(`PARAMETER_SET_ADD_BUTTON`)}</span>
          </Button>
        )}
      </Collapse>

      <Collapse label={t(`PARAMETER_SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">{t(`PARAMETER_SET_CONNECT_NEXT_NODE`)} </span>
          <span className="required">*</span>
        </div>
        <Select
          {...nextNodeId}
          options={scenarios}
          styles={reactSelectStyle}
          value={scenarios.find((item) => item.value === nextNodeId.value)}
          onChange={(options: any) => nextNodeId.onChange(options?.value)}
        />
        {/* <SelectNode fieldName={'nextNodeId'} /> */}
      </Collapse>
    </>
  );
};

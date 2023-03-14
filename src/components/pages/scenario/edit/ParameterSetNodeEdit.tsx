import { FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Collapse } from '@components/general/Collapse';
import { Divider } from '@components/layout';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { SelectNode } from './SelectNode';

export const ParameterSetNodeEdit = () => {
  const { t } = usePage();
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();

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
          <span className="required">*</span>
        </div>
        <FormItem error={errors.nextNodeId}>
          <SelectNode fieldName={'nextNodeId'} />
        </FormItem>
      </Collapse>
    </>
  );
};

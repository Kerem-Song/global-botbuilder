import { Divider } from '@components';
import { FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Collapse } from '@components/general/Collapse';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { nodeHelper } from '@modules/nodeHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const ParameterSetNodeEdit = () => {
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();

  const values = getValues();

  const { fields, append, remove } = useFieldArray({
    name: 'view.parameters',
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

  console.log('value.view in ParameterSetNodeNodeEdit', values.view);
  console.log('errors in Parameter set node edit:', errors);

  return (
    <>
      <Collapse label={'파라미터 설정'} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={i}>
            <div className="m-b-8">
              <span className="subLabel">입력 받을 메시지 </span>
              <span className="required">*</span>
            </div>
            <FormItem
              error={
                errors.view && errors.view.parameters && errors.view.parameters[i]?.name
              }
            >
              <Input
                {...register(`view.parameters.${i}.name`)}
                placeholder="변수를 입력해주세요"
              />
            </FormItem>

            <div className="m-b-8">
              <span className="subLabel">저장할 값 </span>
              <span className="required">*</span>
            </div>
            <FormItem
              error={
                errors.view && errors.view.parameters && errors.view.parameters[i]?.value
              }
            >
              <Input
                {...register(`view.parameters.${i}.value`)}
                placeholder="변수/엔티티/상수로 입력해주세요"
              />
            </FormItem>
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                Delete Condition
              </Button>
            </div>
          </div>
        ))}

        {fields.length < 10 && (
          <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
            <span>+ Parameter Setting</span>
          </Button>
        )}
      </Collapse>
    </>
  );
};
